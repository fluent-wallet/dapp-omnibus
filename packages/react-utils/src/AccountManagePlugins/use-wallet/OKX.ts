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
} from '@cfxjs/use-wallet-react/ethereum/OKX';
import type { WalletProvider, Status } from '../../AccountManage/types';

const walletProvider = {
  walletName: 'OKX Wallet',
  walletIcon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJDSURBVHgB7Zq9jtpAEMfHlhEgQLiioXEkoAGECwoKxMcTRHmC5E3IoyRPkPAEkI7unJYmTgEFTYwA8a3NTKScLnCHN6c9r1e3P2llWQy7M/s1Gv1twCP0ej37dDq9x+Zut1t3t9vZjDEHIiSRSPg4ZpDL5fxkMvn1cDh8m0wmfugfO53OoFQq/crn8wxfY9EymQyrVCqMfHvScZx1p9ls3pFxXBy/bKlUipGPrVbLuQqAfsCliq3zl0H84zwtjQrOw4Mt1W63P5LvBm2d+Xz+YzqdgkqUy+WgWCy+Mc/nc282m4FqLBYL+3g8fjDxenq72WxANZbLJeA13zDX67UDioL5ybXwafMYu64Ltn3bdDweQ5R97fd7GyhBQMipx4POeEDHIu2LfDdBIGGz+hJ9CQ1ABjoA2egAZPM6AgiCAEQhsi/C4jHyPA/6/f5NG3Ks2+3CYDC4aTccDrn6ojG54MnEvG00GoVmWLIRNZ7wTCwDHYBsdACy0QHIhiuRETxlICWpMMhGZHmqS8qH6JLyGegAZKMDkI0uKf8X4SWlaZo+Pp1bRrwlJU8ZKLIvUjKh0WiQ3sRUbNVq9c5Ebew7KEo2m/1p4jJ4qAmDaqDQBzj5XyiAT4VCQezJigAU+IDU+z8vJFnGWeC+bKQV/5VZ71FV6L7PA3gg3tXrdQ+DgLhC+75Wq3no69P3MC0NFQpx2lL04Ql9gHK1bRDjsSBIvScBnDTk1WrlGIZBorIDEYJj+rhdgnQ67VmWRe0zlplXl81vcyEt0rSoYDUAAAAASUVORK5CYII=',
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
