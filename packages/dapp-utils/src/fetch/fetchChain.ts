import ky, { type Options } from 'ky';
import { fetchBase } from './utils';
let id = 0;

interface Params {
  url: string;
  key?: string;
  method?: string;
  params?: Array<unknown>;
  options?: Options;
  throttle?: false | number;
}

/**
 * 
 * @param {string} url - Default eSpace RpcUrl.
 * @param {string} method - Default 'cfx_call' or 'eth_call'.
 * @param {Array<unknown>} params - Json rpc params.
 * @param {Options} options - ky options.
 * @param {number} throttle - Default 250(ms). New requests made within the last request throttle time will not be sent.
 * @param {string} key - Throttle Cache key. If not set, use stringify(method & params) as key.
 * 
 * @example
 * fetchChain({
    method: 'cfx_getTransactionReceipt',
    params: [transactionHash],
  });
 * fetchChain({
      method: 'eth_getBalance',
      params: [account, 'latest'],
    });
 */
export const fetchChain = <T>({ url, key, method, params, options, throttle }: Params): Promise<T> => {
  const json = {
    jsonrpc: '2.0',
    method: method ?? (url.includes('test.confluxrpc.com') || url.includes('main.confluxrpc.com') ? 'cfx_call' : 'eth_call'),
    params,
  };

  const currentId = ++id;
  const jsonWithId = {
    ...json,
    id: currentId,
  };

  return fetchBase({
    key: key ?? JSON.stringify(json),
    throttle,
    fetcher: () =>
      ky
        .post(url, {
          json: jsonWithId,
          ...options,
        })
        .json()
        .then((_res) => {
          const res = _res as { id: number; result: T; jsonrpc: string };
          if (res?.id === currentId && res?.result !== '0x') {
            return res?.result;
          }
          throw new Error('Invalid response');
        }),
  });
};

export const createFetchChain =
  (url: string) =>
  <T>(params: Omit<Params, 'url'>) =>
    fetchChain<T>({ url, ...params });
