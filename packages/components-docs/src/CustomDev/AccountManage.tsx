import { type FC } from 'react';
import { registerWallet, useCurrentWalletName, connect, useAccount, useChainId } from '@cfx-kit/react-utils/src/AccountManage';
import { MetaMaskProvider, FluentProvider, OKXProvider, createWalletConnectProvider } from '@cfx-kit/react-utils/src/AccountManagePlugins';

const WalletConnectProvider = createWalletConnectProvider({ projectId: 'ecd29726bdb28aef6ceded6a6c4319f6', targetChainId: '71' });
registerWallet(MetaMaskProvider);
registerWallet(FluentProvider);
registerWallet(WalletConnectProvider);

const App: FC = () => {
  const account = useAccount();
  const chainId = useChainId();
  const currentWalletName = useCurrentWalletName();

  return (
    <>
      <button onClick={() => connect(MetaMaskProvider.walletName)}>Connect MetaMask</button>
      <button onClick={() => connect(FluentProvider.walletName)}>Connect Fluent</button>
      <button onClick={() => connect(OKXProvider.walletName)}>Connect OKX</button>
      <button onClick={() => connect(WalletConnectProvider.walletName)}>Connect WalletConnect</button>

      <div>
        <div>Current Wallet: {currentWalletName}</div>
        <div>Account: {account}</div>
        <div>ChainId: {chainId}</div>
      </div>
    </>
  );
};

export default App;
