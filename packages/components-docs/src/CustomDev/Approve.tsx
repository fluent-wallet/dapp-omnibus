import { useState, type FC } from 'react';
import { useAuthERC20Token } from '@cfx-kit/react-utils/src/approve';
import { registerWallet, useCurrentWalletName, connect, useAccount, useChainId } from '@cfx-kit/react-utils/src/AccountManage';
import { FluentEthereumProvider } from '@cfx-kit/react-utils/src/AccountManagePlugins';
import { Unit } from '@cfxjs/use-wallet-react/ethereum';

registerWallet(FluentEthereumProvider);

const App: FC = () => {
  const [amount, setAmount] = useState<number>(0);
  const account = useAccount();
  const chainId = useChainId();
  const currentWalletName = useCurrentWalletName();
  const tokenDecimals = 18;
  const { allowance, approveStatus, refresh, handleApprove } = useAuthERC20Token({
    rpcUrl: 'https://evmtestnet.confluxrpc.com',
    tokenAddress: '0x7d682e65efc5c13bf4e394b8f376c48e6bae0355',
    tokenDecimals,
    contractAddress: '0x59a915408561d4724ba50312fe41f46062035c12',
    amount: String(amount ?? ''),
    account,
  });
  return (
    <>
      <button onClick={() => connect(FluentEthereumProvider.walletName)}>Connect Fluent</button>
      <div>
        <div>Current Wallet: {currentWalletName}</div>
        <div>Account: {account}</div>
        <div>ChainId: {chainId}</div>
      </div>
      <p>amount: <input type='number' value={amount} onChange={(e) => setAmount(Number(e.target.value))} /></p>
      <p>allowance: {allowance !== undefined ? new Unit(allowance).toDecimalStandardUnit(undefined, tokenDecimals) : allowance}</p>
      <p>approveStatus: {approveStatus}</p>
      <button disabled={approveStatus !== 'need-approve'} onClick={handleApprove}>approve</button>
      <button onClick={refresh}>refresh</button>
    </>
  );
};

export default App;
