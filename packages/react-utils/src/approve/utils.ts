import waitAsyncResult from '@cfx-kit/utils/dist/waitAsyncResult';
import { fetchChain } from '@cfx-kit/dapp-utils/dist/fetch';

const isTransactionReceipt = async (txHash: string, rpcUrl: string) => {
  const txReceipt: { blockNumber: string; blockHash: string; transactionHash: string; from: string; to: string; status: '0x0' | '0x1' } = await fetchChain({
    url: rpcUrl,
    method: 'eth_getTransactionReceipt',
    params: [txHash],
  });

  if (txReceipt && txReceipt.blockNumber) {
    return txReceipt;
  }
  return undefined;
};

export const waitTransactionReceipt = (txHash: string, rpcUrl: string) => waitAsyncResult({ fetcher: () => isTransactionReceipt(txHash, rpcUrl), interval: 2 });