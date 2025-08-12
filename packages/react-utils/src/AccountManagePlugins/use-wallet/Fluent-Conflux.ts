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
} from '@cfxjs/use-wallet-react/conflux/Fluent';
import type { WalletProvider, Status } from '../../AccountManage/types';

export const walletProvider = {
  walletName: 'Fluent',
  walletIcon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48bWFzayBpZD0iYSIgc3R5bGU9Im1hc2stdHlwZTphbHBoYSIgbWFza1VuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeD0iMCIgeT0iMCIgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIj48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMCAwaDMydjMySDB6Ii8+PC9tYXNrPjxnIG1hc2s9InVybCgjYSkiPjxwYXRoIGQ9Ik0yOSA0djMuODYxYzAgNC40NDQtMy41NyA4LjA1NS04LjAwMSA4LjEyN2wtLjEzNS4wMDFIMTd2My44NzFDMTcgMjQuNDMzIDEzLjM3IDI4IDguODk3IDI4SDV2LTMuOTc2LTguNjQ0QzUgOS4wOTUgMTAuMSA0IDE2LjM5IDRIMjl6IiBmaWxsPSIjZmZmIi8+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0yMy44NDggNGg1LjE1MXYzLjg2YzAgNC41NzMtMy42MyA4LjE0LTguMTAyIDguMTRIMTd2LTMuOTczYzAtNC4wNTEgMi45NjYtNy40MSA2Ljg0OC04LjAyN3oiIGZpbGw9IiMyNDIyNjUiIGZpbGwtb3BhY2l0eT0iLjgiLz48cGF0aCBkPSJNMjkgNHYzLjg2MWMwIDQuNDQ0LTMuNTcgOC4wNTUtOC4wMDEgOC4xMjdsLS4xMzUuMDAxSDE3djMuODcxQzE3IDI0LjQzMyAxMy4zNyAyOCA4Ljg5NyAyOEg1di0zLjk3Ni04LjY0NEM1IDkuMDk1IDEwLjEgNCAxNi4zOSA0SDI5eiIgZmlsbD0iIzYxNkVFMSIgZmlsbC1vcGFjaXR5PSIuOCIvPjwvZz48L3N2Zz4=',
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
