import { useEffect, type FC } from 'react';
import { fetchChain } from '@cfx-kit/dapp-utils/src/fetch';
import { createERC20Contract } from '@cfx-kit/dapp-utils/src/contract';
const ERC20Contract = createERC20Contract('0x7d682e65efc5c13bf4e394b8f376c48e6bae0355');

const App: FC = () => {
  
  useEffect(() => {
    fetchChain<bigint>({
      url: 'https://evmtestnet.confluxrpc.com',
      params: [{
        data: ERC20Contract.encodeFunctionData('totalSupply', []),
        to: ERC20Contract.address,
      }],
      responseHandler: (res: string) => ERC20Contract.decodeFunctionResult('totalSupply', res)?.[0]
    }).then((res) => {
      console.log(res);
    });
  }, []);

  return <></>;
};

export default App;
