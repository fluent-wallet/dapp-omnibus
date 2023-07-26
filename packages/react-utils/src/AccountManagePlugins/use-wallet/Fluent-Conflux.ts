import { store, connect, sendTransaction, watchAsset, addChain, switchChain, typedSign } from '@cfxjs/use-wallet-react/conflux/Fluent';

const walletProvider = {
  walletName: 'Fluent-Conflux',
  subAccountChange: (callback: (account: string | undefined) => void) => {
    store.subscribe(
      (state) => state.accounts,
      (accounts) => {
        callback(accounts?.[0]);
      },
    );
  },
  subChainIdChange: (callback: (account: string | undefined) => void) => {
    store.subscribe(
      (state) => state.chainId,
      (chainId) => {
        callback(chainId);
      },
    );
  },
  connect,
  sendTransaction,
  watchAsset,
  addChain,
  switchChain,
  typedSign,
  getAccount: () => store.getState().accounts?.[0],
  getChainId: () => store.getState().chainId,
} as const;

export default walletProvider;
