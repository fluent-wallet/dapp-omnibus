/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import ky, { type Options } from 'ky';
import { fetchBase, isFunction } from './utils';
let id = 0;

export interface Params {
  url: string;
  key?: string;
  method?: string;
  params?: Array<unknown>;
  options?: Options;
  throttle?: false | number;
  responseHandler?: Function;
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
export const fetchChain = <T>({ url, key, method, params, options, throttle, responseHandler }: Params): Promise<T> => {
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
            if (isFunction(responseHandler)) {
              return responseHandler(res?.result) as unknown as T;
            }
            return res?.result;
          }
          throw new Error('Invalid response');
        }),
  });
};

export interface FetchChainBatchParams<T extends string> {
  url: string;
  key?: string;
  batch: Record<
    T,
    {
      method?: string;
      params?: Array<unknown>;
    }
  >;
  options?: Options;
  throttle?: false | number;
}

// export const fetchChainBatch = <T extends string>({ url, key, options, throttle, batch }: FetchChainBatchParams<T>): Promise<Record<T, any>> => {
//   const json = Object.values(batch as any).map(({ method, params }) => ({
//     jsonrpc: '2.0',
//     method: method ?? (url.includes('test.confluxrpc.com') || url.includes('main.confluxrpc.com') ? 'cfx_call' : 'eth_call'),
//     params,
//   }));

//   const jsonWithId = json.map((item) => ({ ...item, id: ++id }));

//   return fetchBase({
//     key: key ?? JSON.stringify(json),
//     throttle,
//     fetcher: () =>
//       ky
//         .post(url, {
//           json: jsonWithId,
//           ...options,
//         })
//         .json()
//         .then((res) => {
//           if (Array.isArray(res)) {
//             return res.map((item) => {
//               if (item?.result !== '0x') {
//                 return item?.result;
//               }
//               throw new Error('Invalid response');
//             }) as unknown as T;
//           }
//           throw new Error('Invalid response');
//         }),
//   });
// };

export const createFetchChain =
  (url: string) =>
  <T>(params: Omit<Params, 'url'>) =>
    fetchChain<T>({ url, ...params });
// export const createFetchChainBatch =
//   (url: string) =>
//   <T extends Record<string, any>>(params: Omit<FetchChainBatchParams, 'url'>) =>
//     fetchChainBatch<T>({ url, ...params });
