import { useEffect, type FC } from 'react';
import Modal from '@cfx-kit/ui-components/src/Modal';
import { fetchChain } from '@cfx-kit/dapp-utils/src/fetch';

const App: FC = () => {
  useEffect(() => {
    fetchChain({
      url: 'https://evmtestnet.confluxrpc.com',
      method: 'eth_getTransactionReceipt',
      params: ['0xea29089e7aeead5ae2d30ba7ffe260679a9abd4100614aee897baeea69560479'],
    }).then((res) => {
      console.log(res);
    });
  }, []);

  return <></>;
};

export default App;
