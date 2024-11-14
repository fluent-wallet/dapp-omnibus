import type { FC } from 'react';
import { registerWallet, useCurrentWalletName, connect, useAccount, useChainId, useBalance, sendTransaction, typedSign, personalSign, useRegisteredWallets, disconnect } from '@cfx-kit/react-utils/src/AccountManage';
import {
  MetaMaskProvider,
  FluentEthereumProvider,
  CoinbaseProvider,
  createWalletConnectProvider,
} from '@cfx-kit/react-utils/src/AccountManagePlugins';
import { Unit } from '@cfxjs/use-wallet-react/ethereum';

const WalletConnectProvider = createWalletConnectProvider({
  projectId: 'ecd29726bdb28aef6ceded6a6c4319f6', targetChainId: 'eip155:1030',
  metadata: {
    name: "Goledo",
    description:
      "Goledo is a lending and borrowing market built on Conflux eSpace. Lend your assets to begin earning and use them to collateralize loans.",
    url: window.location.host,
    icons: ["https://walletconnect.com/walletconnect-logo.png"],
  },
});
registerWallet(CoinbaseProvider);
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
  const wallets = useRegisteredWallets();
  console.log('wallets', wallets.map((wallet) => wallet.status));

  return (
    <>
      {/* for balance auto refresh test */}
      <BalanceTest />
      <>
        {wallets.map((wallet) => (
          <button key={wallet.walletName} onClick={() => connect(wallet.walletName)}>Connect {wallet.walletName} ({wallet.status})</button>
        ))}
      </>

      <div>
        <div>Current Wallet: {currentWalletName}</div>
        <div>Account: {account}</div>
        <div>ChainId: {chainId}</div>
        {currentWalletName && <button onClick={() => disconnect()}>Disconnect</button>}
        <button
          onClick={() =>
            sendTransaction({
              from: account,
              to: 'cfxtest:aasbpwfcd78mr02g2ya53dh05tgveaawdp3w8y3zae',
              value: Unit.fromStandardUnit(1).toHexMinUnit(),
              // maxFeePerGas: Unit.fromMinUnit(12).mul(1e9).toHexMinUnit(),
              // gasLimit:  Unit.fromMinUnit(20000).toHexMinUnit(),
            })
          }
        >
          send1 CFX to Self
        </button>
        <button
          onClick={() => personalSign('1234')}
        >
          Personal Sign
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
