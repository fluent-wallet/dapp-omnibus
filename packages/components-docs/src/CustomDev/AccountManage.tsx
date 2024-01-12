import { type FC } from 'react';
import { registerWallet, useCurrentWalletName, connect, useAccount, useChainId, useBalance, useBalanceTracker } from '@cfx-kit/react-utils/src/AccountManage';
import { MetaMaskProvider, FluentEthereumProvider, OKXProvider, FluentConfluxProvider, createWalletConnectProvider } from '@cfx-kit/react-utils/src/AccountManagePlugins';

const WalletConnectProvider = createWalletConnectProvider({ projectId: 'ecd29726bdb28aef6ceded6a6c4319f6', targetChainId: '71' });
registerWallet(MetaMaskProvider);
registerWallet(FluentConfluxProvider);
registerWallet(FluentEthereumProvider);
registerWallet(WalletConnectProvider);

const App: FC = () => {
  const account = useAccount();
  const chainId = useChainId();
  const balance = useBalance();
  const BalanceTracker = useBalanceTracker();
  const currentWalletName = useCurrentWalletName();

  return (
    <>
      {/* for balance auto refresh */}
      <BalanceTracker />
      <button onClick={() => connect(MetaMaskProvider.walletName)}>Connect MetaMask</button>
      <button onClick={() => connect(FluentEthereumProvider.walletName)}>Connect Fluent</button>
      <button onClick={() => connect(FluentConfluxProvider.walletName)}>Connect Fluent</button>
      <button onClick={() => connect(OKXProvider.walletName)}>Connect OKX</button>
      <button onClick={() => connect(WalletConnectProvider.walletName)}>Connect WalletConnect</button>

      <div>
        <div>Current Wallet: {currentWalletName}</div>
        <div>Account: {account}</div>
        <div>ChainId: {chainId}</div>
        <div>
          Decimal representation of user balance in StandardUnit: <span style={{ fontWeight: 700 }}>{balance?.toDecimalStandardUnit()}</span>
        </div>
        <div>
          Hexadecimal representation of the user balance in StandardUnit: <span style={{ fontWeight: 700 }}>{balance?.toHexStandardUnit()}</span>
        </div>
        <div>
          Decimal representation of user balance in MinUnit: <span style={{ fontWeight: 700 }}>{balance?.toDecimalMinUnit()}</span>
        </div>
        <div>
          Hexadecimal representation of the user balance in MinUnit: <span style={{ fontWeight: 700 }}>{balance?.toHexMinUnit()}</span>
        </div>
      </div>
    </>
  );
};

export default App;
