import type { FC } from 'react';
import {
  registerWallet,
  useCurrentWalletName,
  connect,
  useAccount,
  useStatus,
  useChainId,
  useBalance,
  sendTransaction,
  typedSign,
  personalSign,
  useRegisteredWallets,
  disconnect,
  createPrioritySorter,
} from '@cfx-kit/react-utils/src/AccountManage';
import {
  MetaMaskProvider,
  FluentEthereumProvider,
  CoinbaseProvider,
  createWalletConnectProvider,
  register6963Wallet,
} from '@cfx-kit/react-utils/src/AccountManagePlugins';
import { connect as connectFluent, useAccount as useAccountFluent, useChainId as useChainIdFluent, useStatus as useStatusFluent, useBalance as useBalanceFluent } from '@cfxjs/use-wallet-react/conflux/Fluent';
import { Unit } from '@cfxjs/use-wallet-react/ethereum';

const WalletConnectProvider = createWalletConnectProvider({
  projectId: 'ecd29726bdb28aef6ceded6a6c4319f6',
  targetChainId: 'eip155:1030',
  metadata: {
    name: 'Goledo',
    description: 'Goledo is a lending and borrowing market built on Conflux eSpace. Lend your assets to begin earning and use them to collateralize loans.',
    url: window.location.host,
    icons: ['https://walletconnect.com/walletconnect-logo.png'],
  },
});

register6963Wallet();
registerWallet(CoinbaseProvider);
registerWallet(FluentEthereumProvider);
registerWallet(WalletConnectProvider);

const prioritySorter = createPrioritySorter(['Fluent', 'WalletConnect', 'Rabby Wallet']);

const BalanceTest: FC = () => {
  useBalance();
  return null;
};

const App: FC = () => {
  const account = useAccount();
  const chainId = useChainId();
  const balance = useBalance();
  const currentWalletName = useCurrentWalletName();
  const wallets = useRegisteredWallets(prioritySorter);
  const status = useStatus();
  const coreAccount = useAccountFluent();
  const coreChainId = useChainIdFluent();
  const coreStatus = useStatusFluent();

  return (
    <>
      <button onClick={() => connectFluent()}>Connect Fluent</button>
      <div>Core Account: {coreAccount}</div>
      <div>Core ChainId: {coreChainId}</div>
      <div>Core Status: {coreStatus}</div>

      {/* for balance auto refresh test */}
      <BalanceTest />
      <div>
        <div>
          Current Wallet: {currentWalletName}
          {currentWalletName && <button onClick={() => disconnect()}>Disconnect</button>}
        </div>
        <div>Account: {account}</div>
        <div>ChainId: {chainId}</div>
        <div>Status: {status}</div>
        <div>Balance: {balance?.toDecimalStandardUnit()}</div>
      </div>
      <>
        {wallets.map((wallet) => (
          <button key={wallet.walletName} onClick={() => connect(wallet.walletName)}>
            Connect {wallet.walletName}
            <img src={wallet.walletIcon} alt={wallet.walletName} />({wallet.status})
          </button>
        ))}
      </>

      <div>
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
        <button onClick={() => personalSign('1234')}>Personal Sign</button>
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
