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

export const walletProvider = {
  walletName: 'TokenPocket',
  walletIcon: 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNDAgNDAiIHdpZHRoPSI0MHB4IiBjb2xvcj0idGV4dCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBjbGFzcz0ic2MtNWE2OWZkNWUtMCBnbFF3Rk0iPjxwYXRoIGQ9Ik0xNy42NzU1IDEzLjE0MTVWNS43MzkxNEgzLjk4MTE0QzMuNzAzNTUgNS43MzkxNCAzLjUxODQ5IDUuOTI0MTkgMy41MTg0OSA2LjIwMTc4VjE2LjY1NzZDMy41MTg0OSAxNi45MzUyIDMuNzAzNTUgMTcuMTIwMyAzLjk4MTE0IDE3LjEyMDNIOS4yNTUzMlYzNi4xODE0QzkuMjU1MzIgMzYuNDU4OSA5LjQ0MDM4IDM2LjY0NCA5LjcxNzk3IDM2LjY0NEgxOC4zMjMyQzE4LjYwMDggMzYuNjQ0IDE4Ljc4NTkgMzYuNDU4OSAxOC43ODU5IDM2LjE4MTRWMTMuMTQxNUgxNy42NzU1WiIgZmlsbD0iIzI5QUVGRiI+PC9wYXRoPjxwYXRoIGQ9Ik0yNy4yMDYxIDMuMzMzMzdIMjMuODc1SDE0Ljg5OTdDMTQuNjIyMSAzLjMzMzM3IDE0LjQzNyAzLjUxODQzIDE0LjQzNyAzLjc5NjAyVjMzLjc3NTZDMTQuNDM3IDM0LjA1MzIgMTQuNjIyMSAzNC4yMzgyIDE0Ljg5OTcgMzQuMjM4MkgyMy41MDQ5QzIzLjc4MjUgMzQuMjM4MiAyMy45Njc2IDM0LjA1MzIgMjMuOTY3NiAzMy43NzU2VjI2LjE4ODJIMjcuMjk4NkMzMy41OTA2IDI2LjE4ODIgMzguNjc5NyAyMS4wOTkgMzguNjc5NyAxNC44MDdDMzguNjc5NyA4LjQyMjUgMzMuNDk4MSAzLjMzMzM3IDI3LjIwNjEgMy4zMzMzN1oiIGZpbGw9IiMyNzYxRTciPjwvcGF0aD48L3N2Zz4K',
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
