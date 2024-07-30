import {
  store,
  connect,
  sendTransaction,
  watchAsset,
  addChain,
  switchChain,
  typedSign,
  personalSign,
  type Unit,
  startTrackBalance,
  stopTrackBalance,
} from '@cfxjs/use-wallet-react/ethereum/TokenPocket';
import type { WalletProvider, Status } from '../../AccountManage/types';

const walletProvider = {
  walletName: 'TokenPocket',
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
  subBalanceChange: (callback: (balance: Unit | undefined) => void) => {
    store.subscribe(
      (state) => state.balance,
      (balance) => {
        callback(balance);
      },
    );
  },
  subStatusChange: (callback: (status: Status | undefined) => void) => {
    store.subscribe(
      (state) => state.status,
      (status) => {
        callback(status);
      },
    );
  },
  connect,
  sendTransaction,
  watchAsset,
  addChain,
  switchChain,
  typedSign,
  personalSign,
  getAccount: () => store.getState().accounts?.[0],
  getChainId: () => store.getState().chainId,
  getBalance: () => store.getState().balance,
  getStatus: () => store.getState().status,
  startTrackBalance,
  stopTrackBalance,
} as WalletProvider;

export default walletProvider;
