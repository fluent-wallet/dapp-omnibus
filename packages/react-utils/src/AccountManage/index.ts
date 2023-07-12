import { atom, selector, useRecoilValue, type RecoilState } from 'recoil';
import { setRecoil, getRecoil } from 'recoil-nexus';
import { persistAtom } from '../recoilUtils';
import type { AddChainParameter, TypedSignParams, WatchAssetParams, TransactionParameters } from './types';
export * from './types';

interface WalletProvider {
  walletName: string;
  subAccountChange: (callback: (account: string | undefined) => void) => void;
  subChainIdChange: (callback: (account: string | undefined) => void) => void;
  connect: () => Promise<unknown>;
  sendTransaction: (transaction: TransactionParameters) => Promise<string>;
  watchAsset?: (asset: WatchAssetParams) => Promise<unknown>;
  addChain?: (chain: AddChainParameter) => Promise<unknown>;
  switchChain?: (chainId: string) => Promise<unknown>;
  typedSign?: (data: TypedSignParams) => Promise<string>;
  disconnect?: () => Promise<void> | void;
  getAccount?: () => string | undefined;
  getChainId?: () => string | undefined;
}

const walletsStateMap = new Map<
  string,
  { provider: WalletProvider; accountState: RecoilState<string | undefined>; chainIdState: RecoilState<string | undefined> }
>();
export const registerWallet = (walletProvider: WalletProvider) => {
  const walletAccountState = atom({
    key: `walletAccountState-${walletProvider.walletName}`,
    default: walletProvider?.getAccount?.(),
  });
  const walletChainIdState = atom({
    key: `walletChainIdState-${walletProvider.walletName}`,
    default: walletProvider?.getChainId?.(),
  });
  walletProvider.subAccountChange((account) => {
    setRecoil(walletAccountState, account);
  });
  walletProvider.subChainIdChange((chainId) => {
    setRecoil(walletChainIdState, chainId);
  });
  walletsStateMap.set(walletProvider.walletName, { provider: walletProvider, accountState: walletAccountState, chainIdState: walletChainIdState });
};

const currentWalletNameState = atom<string | null>({
  key: 'currentWalletNameState',
  default: null,
  effects: [persistAtom],
});

const accountState = selector({
  key: 'accountState',
  get: ({ get }) => {
    const currentWalletName = get(currentWalletNameState);
    if (!currentWalletName) return undefined;
    const walletState = walletsStateMap.get(currentWalletName);
    if (!walletState) throw new Error(`CurrentWallet - ${currentWalletName} is not registered`);
    return get(walletState.accountState);
  },
});

const chainIdState = selector({
  key: 'chainIdState',
  get: ({ get }) => {
    const currentWalletName = get(currentWalletNameState);
    if (!currentWalletName) return undefined;
    const walletState = walletsStateMap.get(currentWalletName);
    if (!walletState) throw new Error(`CurrentWallet - ${currentWalletName} is not registered`);
    return get(walletState.chainIdState);
  },
});

export const useAccount = () => useRecoilValue(accountState);
export const getAccount = () => getRecoil(accountState);
export const useChainId = () => useRecoilValue(chainIdState);
export const getChainId = () => getRecoil(chainIdState);

export const connect = async (walletName: string) => {
  const walletState = checkWalletState({ walletName, checkFunctionName: 'connect' });
  try {
    await walletState.provider.connect();
    setRecoil(currentWalletNameState, walletName);
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
    setRecoil(currentWalletNameState, null);
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
  const currentWalletName = getRecoil(currentWalletNameState);
  if (!currentWalletName) {
    throw new Error('No account connected');
  }
  return currentWalletName;
}

function checkWalletState({ walletName, checkFunctionName }: { walletName?: string; checkFunctionName?: keyof WalletProvider }) {
  const currentWalletName = walletName || (getRecoil(currentWalletNameState) as string);
  const walletState = walletsStateMap.get(currentWalletName);
  if (!walletState) {
    throw new Error(`Wallet - ${currentWalletName} is not registered`);
  }
  if (typeof checkFunctionName === 'string' && !!checkFunctionName && typeof walletState?.provider?.[checkFunctionName] !== 'function') {
    throw new Error(`Wallet - ${currentWalletName} is not support ${checkFunctionName}`);
  }
  return walletState;
}
