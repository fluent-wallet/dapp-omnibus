/* eslint-disable @typescript-eslint/no-explicit-any */
import { create, type UseBoundStore, type StoreApi } from 'zustand';
import { subscribeWithSelector, persist, createJSONStorage } from 'zustand/middleware';
import type {
  AddChainParameter,
  TypedSignParams,
  WatchAssetParams,
  TransactionParameters,
  Write,
  StoreSubscribeWithSelector,
  WalletProvider,
  Status,
} from './types';
import type { Unit } from '@cfxjs/use-wallet-react/ethereum';
import { useEffect, useState } from 'react';
export * from './types';

interface WalletState {
  account: string | undefined;
  accounts: Array<string> | undefined;
  chainId: string | undefined;
  status: Status | undefined;
  balance?: Unit;
}

type WalletStore = UseBoundStore<Write<StoreApi<WalletState>, StoreSubscribeWithSelector<WalletState>>>;

type MappedWallet = {
  provider: WalletProvider;
  walletStore: WalletStore;
};

const walletsStateMap = new Map<string, MappedWallet>();
const listeners: ((wallets: Array<MappedWallet>) => void)[] = [];
const notifyListeners = () => {
  const walletsArray = Array.from(walletsStateMap.values());
  listeners.forEach((listener) => listener(walletsArray));
};
const addWalletToMap = (key: string, wallet: MappedWallet) => {
  walletsStateMap.set(key, wallet);
  notifyListeners();
};

export const getRegisteredWallets = () =>
  Array.from(walletsStateMap.values()).map((wallet) => ({
    ...wallet,
    walletName: wallet.provider.walletName,
    walletIcon: wallet.provider.walletIcon,
    status: wallet.walletStore.getState().status,
  }));
export const getRegisteredWalletsName = () => getRegisteredWallets().map((wallet) => wallet.provider.walletName);

export type WalletItem = ReturnType<typeof getRegisteredWallets>[number];
export type WalletSorter = (a: WalletItem, b: WalletItem) => number;
export const createPrioritySorter = (priorityList: string[] = []): WalletSorter => {
  return (a, b) => {
    const aRdns = a.provider?.eip6963Info?.rdns;
    const bRdns = b.provider?.eip6963Info?.rdns;
    const aName = a.walletName;
    const bName = b.walletName;

    const aIdx = priorityList.findIndex(
      (item) => item === aRdns || item === aName
    );
    const bIdx = priorityList.findIndex(
      (item) => item === bRdns || item === bName
    );

    if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
    if (aIdx !== -1) return -1;
    if (bIdx !== -1) return 1;
    return aName.localeCompare(bName);
  };
};

const dedupAndSort = (wallets: WalletItem[], sorter: WalletSorter): WalletItem[] => {
  const seenRdns = new Set<string>();
  const seenWalletName = new Set<string>();
  const withRdns = wallets.filter(wallet => {
    const rdns = wallet.provider?.eip6963Info?.rdns;
    if (!rdns) return false;
    if (seenRdns.has(rdns)) return false;
    seenRdns.add(rdns);
    seenWalletName.add(wallet.walletName);
    return true;
  });

  const withoutRdns = wallets.filter(wallet => {
    const rdns = wallet.provider?.eip6963Info?.rdns;
    if (rdns) return false;
    if (seenWalletName.has(wallet.walletName)) return false;
    seenWalletName.add(wallet.walletName);
    return true;
  });
  return [...withRdns, ...withoutRdns].sort(sorter);
}

const defaultSorter = createPrioritySorter(['Fluent']);
export const useRegisteredWallets = (sorter: WalletSorter = defaultSorter) => {
  const [wallets, setWallets] = useState(() => {
    const raw = getRegisteredWallets();
    return dedupAndSort(raw, sorter);
  });

  useEffect(() => {
    const updateWallets = (newWallets: Array<MappedWallet>) => {
      const mapped = newWallets.map((wallet) => ({
        ...wallet,
        walletName: wallet.provider.walletName,
        walletIcon: wallet.provider.walletIcon,
        status: wallet.walletStore.getState().status,
      }));
      setWallets(dedupAndSort(mapped, sorter));
    };

    listeners.push(updateWallets);

    return () => {
      const index = listeners.indexOf(updateWallets);
      if (index !== -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);

  useEffect(() => {
    const unsubs = wallets.map((wallet, indexOuter) =>
      wallet.walletStore.subscribe(
        (state) => state.status,
        (newStatus) => {
          setWallets((prevWallets) =>
            dedupAndSort(
              prevWallets.map((prevWallet, indexIner) =>
                indexOuter === indexIner ? { ...prevWallet, status: newStatus } : prevWallet
              ),
              sorter
            )
          );
        },
      ),
    );

    return () => {
      unsubs.forEach((unsub) => unsub());
    };
  }, [wallets]);
  return wallets;
};

export const registerWallet = (walletProvider: WalletProvider, { persistFirst }: { persistFirst: boolean } = { persistFirst: true }) => {
  let walletStore: WalletStore;
  if (!persistFirst) {
    walletStore = create(
      subscribeWithSelector<WalletState>(() => ({
        account: undefined,
        accounts: undefined,
        chainId: undefined,
        status: undefined,
        balance: undefined,
      })),
    );
  } else {
    walletStore = create(
      subscribeWithSelector(
        persist<WalletState>(
          () => ({
            account: undefined,
            accounts: undefined,
            chainId: undefined,
            status: undefined,
            balance: undefined,
          }),
          {
            name: `AccountManage-wallet-${walletProvider.walletName}-storage`,
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => Object.fromEntries(Object.entries(state).filter(([key]) => !['balance'].includes(key))) as Omit<WalletState, 'balance'>,
          },
        ),
      ),
    );
  }

  walletProvider.subAccountChange((account) => {
    walletStore.setState({ account, accounts: account ? [account] : undefined });
  });

  walletProvider.subChainIdChange((chainId) => {
    walletStore.setState({ chainId });
  });
  walletProvider.subBalanceChange?.((balance) => {
    walletStore.setState({ balance });
  });
  walletProvider.subStatusChange?.((status) => {
    walletStore.setState({ status });
  });
  if (persistFirst) {
    setTimeout(() => {
      const currentWalletAccount = walletProvider.getAccount?.();
      const currentWalletChainId = walletProvider.getChainId?.();
      const currentBalance = walletProvider.getBalance?.();
      const currentStatus = walletProvider.getStatus?.();
      const persistedAccount = walletStore.getState().account;
      const persistedChainId = walletStore.getState().chainId;
      const persistedBalance = walletStore.getState().balance;
      const persistedStatus = walletStore.getState().status;
      if (persistedAccount !== currentWalletAccount) {
        walletStore.setState({ account: currentWalletAccount, accounts: currentWalletAccount ? [currentWalletAccount] : undefined });
      }
      if (persistedChainId !== currentWalletChainId) {
        walletStore.setState({ chainId: currentWalletChainId });
      }
      if (persistedBalance !== currentBalance) {
        walletStore.setState({ balance: currentBalance });
      }
      if (persistedStatus !== currentBalance) {
        walletStore.setState({ status: currentStatus });
      }
    }, 150);
  } else {
    const account = walletProvider.getAccount?.();
    walletStore.setState({
      account,
      accounts: account ? [account] : undefined,
      chainId: walletProvider.getChainId?.(),
      balance: walletProvider.getBalance?.(),
      status: walletProvider.getStatus?.(),
    });
  }

  addWalletToMap(walletProvider.walletName, { provider: walletProvider, walletStore });
  if (walletProvider.walletName === store.getState().currentWalletName) {
    subWallet(store.getState().currentWalletName);
  }
};


interface State {
  currentWalletName: string | null;
  account: string | undefined;
  accounts: Array<string> | undefined;
  chainId: string | undefined;
  status: Status | undefined;
  balance?: Unit | undefined;
}

export const store = create(
  subscribeWithSelector(
    persist<State>(
      () => ({
        currentWalletName: null,
        account: undefined,
        accounts: undefined,
        chainId: undefined,
        status: undefined,
        balance: undefined,
      }),
      {
        name: 'AccountManage-storage',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => Object.fromEntries(Object.entries(state).filter(([key]) => !['balance'].includes(key))) as Omit<State, 'balance'>,
      },
    ),
  ),
);

let unsubAccount: VoidFunction | null = null;
let unsubChainId: VoidFunction | null = null;
let unsubBalance: VoidFunction | null = null;
let unsubStatus: VoidFunction | null = null;
const subWallet = (currentWalletName: string | null) => {
  if (unsubAccount) {
    unsubAccount?.();
    unsubAccount = null;
  }
  if (unsubChainId) {
    unsubChainId?.();
    unsubChainId = null;
  }
  if (unsubBalance) {
    unsubBalance?.();
    unsubBalance = null;
  }
  if (unsubStatus) {
    unsubStatus?.();
    unsubStatus = null;
  }
  if (!currentWalletName) {
    store.setState({
      account: undefined,
      accounts: undefined,
      chainId: undefined,
      balance: undefined,
      status: undefined,
    });
  } else {
    const walletState = walletsStateMap.get(currentWalletName);
    if (!walletState) {
      store.setState({
        account: undefined,
        accounts: undefined,
        chainId: undefined,
        balance: undefined,
        status: undefined,
      });
    } else {
      unsubAccount = walletState.walletStore.subscribe(
        (state) => state.account,
        (account) => store.setState({ account, accounts: account ? [account] : undefined }),
        { fireImmediately: true },
      );
      unsubChainId = walletState.walletStore.subscribe(
        (state) => state.chainId,
        (chainId) => store.setState({ chainId }),
        { fireImmediately: true },
      );
      unsubBalance = walletState.walletStore.subscribe(
        (state) => state.balance,
        (balance) => store.setState({ balance }),
        { fireImmediately: true },
      );
      unsubStatus = walletState.walletStore.subscribe(
        (state) => state.status,
        (status) => store.setState({ status }),
        { fireImmediately: true },
      );
    }
  }
};
store.subscribe((state) => state.currentWalletName, subWallet, {
  fireImmediately: true,
});

export const selectors = {
  currentWalletName: (state: State) => state.currentWalletName,
  accounts: (state: State) => state.accounts,
  account: (state: State) => state.account,
  chainId: (state: State) => state.chainId,
  balance: (state: State) => state.balance,
  status: (state: State) => state.status,
};

export const useAccount = () => store(selectors.account);
export const getAccount = () => store.getState().account;
export const useChainId = () => store(selectors.chainId);
export const getChainId = () => store.getState().chainId;
export const useStatus = () => store(selectors.status);
export const getStatus = () => store.getState().status;
export const useCurrentWalletName = () => {
  const account = useAccount();
  const currentWalletName = store(selectors.currentWalletName);
  return account ? currentWalletName : null;
};
export const getCurrentWalletName = () => store.getState().currentWalletName;

let referenceCount = 0;
export const useBalance = () => {
  const currentWalletName = useCurrentWalletName();
  const walletState = currentWalletName ? walletsStateMap.get(currentWalletName) : null;
  const provider = walletState?.provider;
  useEffect(() => {
    if (++referenceCount === 1) {
      provider?.startTrackBalance?.();
    }

    return () => {
      if (--referenceCount === 0) {
        provider?.stopTrackBalance?.();
      }
    };
  }, [provider]);

  return store(selectors.balance);
};

export const connect = async (walletName: string) => {
  const walletState = checkWalletState({
    walletName,
    checkFunctionName: 'connect',
  });
  try {
    await walletState.provider.connect();
    store.setState({ currentWalletName: walletName });
  } catch (err) {
    console.error(`Connect to ${walletName} error: `, err);
    throw err;
  }
};

export const disconnect = async (disconnectProvider?: boolean) => {
  checkAccountConnected();
  const walletState = checkWalletState({ checkFunctionName: 'connect' });
  try {
    if (disconnectProvider) {
      await walletState.provider.disconnect?.();
    }
    store.setState({ currentWalletName: null });
  } catch (err) {
    console.error('Disconnect error: ', err);
    throw err;
  }
};

export const switchChain = async (
  chainId: string,
  {
    addChainParams,
    addChainCallback,
    cancleAddCallback,
    cancelSwitchCallback,
  }: {
    addChainParams?: AddChainParameter;
    addChainCallback?: VoidFunction;
    cancleAddCallback?: VoidFunction;
    cancelSwitchCallback?: VoidFunction;
  } = {},
) => {
  checkAccountConnected();
  const walletState = checkWalletState({ checkFunctionName: 'switchChain' });
  try {
    await walletState.provider.switchChain?.(`0x${Number(chainId).toString(16)}`);
  } catch (err) {
    // This error code indicates that the chain has not been added to wallet.
    const switchError = err as { code: number };
    if (switchError?.code === 4902) {
      if (!addChainParams) return;
      try {
        const walletState = checkWalletState({ checkFunctionName: 'addChain' });
        await walletState.provider.addChain?.({
          ...addChainParams,
          chainId: `0x${Number(addChainParams.chainId).toString(16)}`,
        });
        addChainCallback?.();
      } catch (addError) {
        if ((addError as { code: number })?.code === 4001) {
          cancleAddCallback?.();
        }
      }
    } else if (switchError?.code === 4001) {
      cancelSwitchCallback?.();
    }
  }
};

export const sendTransaction = async (params: TransactionParameters) => {
  checkAccountConnected();
  const walletState = checkWalletState({
    checkFunctionName: 'sendTransaction',
  });
  return walletState.provider.sendTransaction(params);
};

export const typedSign = async (params: TypedSignParams) => {
  checkAccountConnected();
  const walletState = checkWalletState({ checkFunctionName: 'typedSign' });
  return walletState.provider.typedSign?.(params);
};

export const personalSign = async (params: string) => {
  checkAccountConnected();
  const walletState = checkWalletState({ checkFunctionName: 'personalSign' });
  return walletState.provider.personalSign?.(params);
};

export const watchAsset = (params: WatchAssetParams) => {
  checkAccountConnected();
  const walletState = checkWalletState({ checkFunctionName: 'watchAsset' });
  return walletState.provider.watchAsset?.(params);
};

function checkAccountConnected() {
  const currentWalletName = getCurrentWalletName();
  if (!currentWalletName) {
    throw new Error('No account connected');
  }
  return currentWalletName;
}

function checkWalletState({ walletName, checkFunctionName }: { walletName?: string; checkFunctionName?: keyof WalletProvider }) {
  const currentWalletName = walletName || (getCurrentWalletName() as string);
  const walletState = walletsStateMap.get(currentWalletName);
  if (!walletState) {
    throw new Error(`Wallet - ${currentWalletName} is not registered`);
  }
  if (typeof checkFunctionName === 'string' && !!checkFunctionName && typeof walletState?.provider?.[checkFunctionName] !== 'function') {
    throw new Error(`Wallet - ${currentWalletName} is not support ${checkFunctionName}`);
  }
  return walletState;
}
