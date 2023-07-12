import { useEffect, type FC } from 'react';
import { registerWallet, connect, useAccount, useChainId } from '@cfx-kit/react-utils/src/AccountManage';
import { MetaMaskProvider, FluentProvider, OKXProvider } from '@cfx-kit/react-utils/src/AccountManagePlugins';

registerWallet(MetaMaskProvider);
registerWallet(FluentProvider);

const App: FC = () => {
  const account = useAccount();
  const chainId = useChainId();
  console.log(account)
  console.log(chainId)

  return (
    <>
      <button onClick={() => connect(MetaMaskProvider.walletName)}>Connect MetaMask</button>
      <button onClick={() => connect(FluentProvider.walletName)}>Connect Fluent</button>
      <button onClick={() => connect(OKXProvider.walletName)}>Connect OKX</button>

      <div>
        <div>Account: {account}</div>
        <div>ChainId: {chainId}</div>
      </div>
    </>
  );
};

export default App;
