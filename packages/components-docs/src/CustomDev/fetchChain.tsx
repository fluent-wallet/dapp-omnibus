import { useEffect, type FC } from 'react';
import { fetchChain, fetchChainBatch } from '@cfx-kit/dapp-utils/src/fetch';
import { createERC20Contract } from '@cfx-kit/dapp-utils/src/contract';
const ERC20Contract = createERC20Contract('0x7d682e65efc5c13bf4e394b8f376c48e6bae0355');

(function () {
  fetchChainBatch({
    url: 'https://evmtestnet.confluxrpc.com',
    batch: {
      totalSupply: {
        method: 'eth_call',
        params: [
          {
            data: ERC20Contract.encodeFunctionData('totalSupply', []),
            to: ERC20Contract.address,
          },
        ],
      },
      getTransactionReceipt: {
        method: 'eth_getTransactionReceipt',
        params: ['0xea29089e7aeead5ae2d30ba7ffe260679a9abd4100614aee897baeea69560479'],
      }, 
      getBlockByNumber: {
        method: 'eth_getBlockByNumber',
        params: [`0x22`, false],
      }
    },
  })
    .then((res) => console.log(res));
})();

const App: FC = () => {
  // useEffect(() => {
  //   fetchChain({
  //     url: 'https://evmtestnet.confluxrpc.com',
  //     method: 'eth_getTransactionReceipt',
  //     params: ['0xea29089e7aeead5ae2d30ba7ffe260679a9abd4100614aee897baeea69560479'],
  //   }).then((res) => {
  //     console.log(res);
  //   });
  // }, []);

  return <></>;
};

function processRecord<T extends string>(input: Record<T, any>): Record<T, any> {
  // 在这里进行处理...
  return input;
}

// 示例使用
const input = {
  foo: 1,
  bar: 'hello',
  baz: true,
};

const result = processRecord(input);
console.log(result); // 输出与输入参数具有相同字符串键名的对象

export default App;
