import  { createWallet, type Unit } from '@cfxjs/use-wallet-react/ethereum/6963';
import { type EIP6963AnnounceProviderEvent, type EIP6963ProviderDetail } from '@cfxjs/use-wallet-react/ethereum/type';
import { registerWallet } from '../../AccountManage';
import type { Status, WalletProvider } from '../../AccountManage/types';

const create6963WalletProvider = (params: EIP6963ProviderDetail) => {
  const wallet = createWallet(params);
  const walletProvider = {
    walletName: params.info.name,
    walletIcon: params.info.icon,
    eip6963Info: params.info,
    subAccountChange: (callback: (account: string | undefined) => void) => {
      wallet.store.subscribe(
        (state) => state.accounts,
        (accounts) => {
          callback(accounts?.[0]);
        },
      );
    },
    subChainIdChange: (callback: (account: string | undefined) => void) => {
      wallet.store.subscribe(
        (state) => state.chainId,
        (chainId) => {
          callback(chainId);
        },
      );
    },
    subBalanceChange: (callback: (balance: Unit | undefined) => void) => {
      wallet.store.subscribe(
        (state) => state.balance,
        (balance) => {
          callback(balance);
        },
      );
    },
    subStatusChange: (callback: (status: Status | undefined) => void) => {
      wallet.store.subscribe(
        (state) => state.status,
        (status) => {
          callback(status);
        },
      );
    },
    connect: wallet.connect.bind(wallet),
    sendTransaction: wallet.sendTransaction.bind(wallet),
    watchAsset: wallet.watchAsset.bind(wallet),
    addChain: wallet.addChain.bind(wallet),
    switchChain: wallet.switchChain.bind(wallet),
    typedSign: wallet.typedSign.bind(wallet),
    personalSign: wallet.personalSign.bind(wallet),
    getAccount: () => wallet.store.getState().accounts?.[0],
    getChainId: () => wallet.store.getState().chainId,
    getBalance: () => wallet.store.getState().balance,
    getStatus: () => wallet.store.getState().status,
    startTrackBalance: wallet.startTrackBalance.bind(wallet),
    stopTrackBalance: wallet.stopTrackBalance.bind(wallet),
  } as WalletProvider;
  return walletProvider;
}


export const register6963Wallet = ({ persistFirst }: { persistFirst: boolean } = { persistFirst: true }) => {
  window.addEventListener(
    "eip6963:announceProvider",
    (event: Event) => {
      const evt = event as EIP6963AnnounceProviderEvent;
      registerWallet(create6963WalletProvider(evt.detail), { persistFirst });
    }
  );

  // The DApp dispatches a request event which will be heard by 
  // Wallets' code that had run earlier
  window.dispatchEvent(new Event("eip6963:requestProvider"));
};
