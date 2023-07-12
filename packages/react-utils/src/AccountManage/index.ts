import { create, type UseBoundStore, type StoreApi } from 'zustand';
import { subscribeWithSelector, persist, createJSONStorage } from 'zustand/middleware';
import type { AddChainParameter, TypedSignParams, WatchAssetParams, TransactionParameters, Write, StoreSubscribeWithSelector } from './types';
export * from './types';

interface WalletProvider {
  walletName: string;
  subAccountChange: (callback: (account: string | undefined) => void) => void;
  subChainIdChange: (callback: (account: string | undefined) => void) => void;
  getAccount: () => string | undefined;
  getChainId: () => string | undefined;
  connect: () => Promise<unknown>;
  sendTransaction: (transaction: TransactionParameters) => Promise<string>;
  watchAsset?: (asset: WatchAssetParams) => Promise<unknown>;
  addChain?: (chain: AddChainParameter) => Promise<unknown>;
  switchChain?: (chainId: string) => Promise<unknown>;
  typedSign?: (data: TypedSignParams) => Promise<string>;
  disconnect?: () => Promise<void> | void;
}

type WalletStore = UseBoundStore<
  Write<
    StoreApi<{
      account: string | undefined;
      chainId: string | undefined;
    }>,
    StoreSubscribeWithSelector<{
      account: string | undefined;
      chainId: string | undefined;
    }>
  >
>;

const walletsStateMap = new Map<
  string,
  {
    provider: WalletProvider;
    walletStore: WalletStore;
  }
>();
export const registerWallet = (walletProvider: WalletProvider, { persistFirst }: { persistFirst: boolean } = { persistFirst: true }) => {
  let walletStore: WalletStore;
  if (!persistFirst) {
    walletStore = create(
      subscribeWithSelector<{ account: string | undefined; chainId: string | undefined }>(() => ({
        account: undefined,
        chainId: undefined,
      })),
    );
  } else {
    walletStore = create(
      subscribeWithSelector(
        persist<{ account: string | undefined; chainId: string | undefined }>(
          () => ({
            account: undefined,
            chainId: undefined,
          }),
          {
            name: `AccountManage-wallet-${walletProvider.walletName}-storage`,
            storage: createJSONStorage(() => localStorage),
          },
        ),
      ),
    );
  }

  walletProvider.subAccountChange((account) => {
    walletStore.setState({ account });
  });
  walletProvider.subChainIdChange((chainId) => {
    walletStore.setState({ chainId });
  });
  if (persistFirst) {
    setTimeout(() => {
      const currentWalletAccount = walletProvider.getAccount?.();
      const currentWalletChainId = walletProvider.getChainId?.();
      const persistedAccount = walletStore.getState().account;
      const persistedChainId = walletStore.getState().chainId;
      if (persistedAccount !== currentWalletAccount) {
        walletStore.setState({ account: currentWalletAccount });
      }
      if (persistedChainId !== currentWalletChainId) {
        walletStore.setState({ chainId: currentWalletChainId });
      }
    }, 150);
  } else {
    walletStore.setState({ account: walletProvider.getAccount?.(), chainId: walletProvider.getChainId?.() });
  }

  walletsStateMap.set(walletProvider.walletName, { provider: walletProvider, walletStore });
  if (walletProvider.walletName === store.getState().currentWalletName) {
    subWallet(store.getState().currentWalletName);
  }
};

interface State {
  currentWalletName: string | null;
  account: string | undefined;
  chainId: string | undefined;
}
export const store = create(
  subscribeWithSelector(
    persist<State>(
      () => ({
        currentWalletName: null,
        account: undefined,
        chainId: undefined,
      }),
      {
        name: 'AccountManage-storage',
        storage: createJSONStorage(() => localStorage),
      },
    ),
  ),
);

let unsubAccount: VoidFunction | null = null;
let unsubChainId: VoidFunction | null = null;
const subWallet = (currentWalletName: string | null) => {
  if (unsubAccount) {
    unsubAccount?.();
    unsubAccount = null;
  }
  if (unsubChainId) {
    unsubChainId?.();
    unsubChainId = null;
  }
  if (!currentWalletName) {
    store.setState({ account: undefined, chainId: undefined });
  } else {
    const walletState = walletsStateMap.get(currentWalletName);
    if (!walletState) {
      store.setState({ account: undefined, chainId: undefined });
    } else {
      unsubAccount = walletState.walletStore.subscribe(
        (state) => state.account,
        (account) => store.setState({ account }),
        { fireImmediately: true },
      );
      unsubChainId = walletState.walletStore.subscribe(
        (state) => state.chainId,
        (chainId) => store.setState({ chainId }),
        { fireImmediately: true },
      );
    }
  }
};
store.subscribe((state) => state.currentWalletName, subWallet, { fireImmediately: true });

export const selectors = {
  currentWalletName: (state: State) => state.currentWalletName,
  account: (state: State) => state.account,
  chainId: (state: State) => state.chainId,
};

export const useAccount = () => store(selectors.account);
export const getAccount = () => store.getState().account;
export const useChainId = () => store(selectors.chainId);
export const getChainId = () => store.getState().chainId;
export const useCurrentWalletName = () => store(selectors.currentWalletName);
export const getCurrentWalletName = () => store.getState().currentWalletName;

export const connect = async (walletName: string) => {
  const walletState = checkWalletState({ walletName, checkFunctionName: 'connect' });
  try {
    await walletState.provider.connect();
    store.setState({ currentWalletName: walletName });
  } catch (err) {
    console.error(`Connect to ${walletName} error: `, err);
    throw err;
  }
};

export const disconnect = async () => {
  checkAccountConnected();
  const walletState = checkWalletState({ checkFunctionName: 'connect' });
  try {
    await walletState.provider.disconnect?.();
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
  }: { addChainParams?: AddChainParameter; addChainCallback?: VoidFunction; cancleAddCallback?: VoidFunction; cancelSwitchCallback?: VoidFunction },
) => {
  checkAccountConnected();
  const walletState = checkWalletState({ checkFunctionName: 'switchChain' });
  try {
    await walletState.provider.switchChain?.('0x' + Number(chainId).toString(16));
  } catch (err) {
    // This error code indicates that the chain has not been added to wallet.
    const switchError = err as { code: number };
    if (switchError?.code === 4902) {
      if (!addChainParams) return;
      try {
        const walletState = checkWalletState({ checkFunctionName: 'addChain' });
        await walletState.provider.addChain?.({
          ...addChainParams,
          chainId: '0x' + Number(addChainParams.chainId).toString(16),
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
  const walletState = checkWalletState({ checkFunctionName: 'switchChain' });
  return walletState.provider.sendTransaction(params);
};

export const typedSign = async (params: TypedSignParams) => {
  checkAccountConnected();
  const walletState = checkWalletState({ checkFunctionName: 'typedSign' });
  return walletState.provider.typedSign?.(params);
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
