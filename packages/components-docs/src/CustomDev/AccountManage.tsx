import { type FC } from 'react';
import { registerWallet, useCurrentWalletName, connect, useAccount, useChainId, useBalance, sendTransaction } from '@cfx-kit/react-utils/src/AccountManage';
import {
  MetaMaskProvider,
  FluentEthereumProvider,
  createWalletConnectProvider,
} from '@cfx-kit/react-utils/src/AccountManagePlugins';
import { Unit } from '@cfxjs/use-wallet-react/ethereum';

const WalletConnectProvider = createWalletConnectProvider({ projectId: 'ecd29726bdb28aef6ceded6a6c4319f6', targetChainId: '71' });
registerWallet(MetaMaskProvider);
registerWallet(FluentEthereumProvider);
registerWallet(WalletConnectProvider);

const BalanceTest: FC = () => {
  useBalance();
  return null;
};

const App: FC = () => {
  const account = useAccount();
  const chainId = useChainId();
  const balance = useBalance();
  const currentWalletName = useCurrentWalletName();

  return (
    <>
      {/* for balance auto refresh test */}
      <BalanceTest />
      <button onClick={() => connect(MetaMaskProvider.walletName)}>Connect MetaMask</button>
      <button onClick={() => connect(FluentEthereumProvider.walletName)}>Connect Fluent</button>
      <button onClick={() => connect(WalletConnectProvider.walletName)}>Connect WalletConnect</button>

      <div>
        <div>Current Wallet: {currentWalletName}</div>
        <div>Account: {account}</div>
        <div>ChainId: {chainId}</div>
        <button
          onClick={() =>
            sendTransaction({
              from: account,
              to: account,
              value: Unit.fromStandardUnit(1).toHexMinUnit(),
              // maxFeePerGas: Unit.fromMinUnit(12).mul(1e9).toHexMinUnit(),
              // gasLimit:  Unit.fromMinUnit(20000).toHexMinUnit(),
            })
          }
        >
          send1 CFX to Self
        </button>
        {/* <div>
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
        </div> */}
      </div>
    </>
  );
};

export default App;
