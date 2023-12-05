/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import ky, { type Options } from 'ky';
import { fetchBase, isFunction } from './utils';
import { createMulticallContract } from '../contract';
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

export const createFetchChain =
  (url: string) =>
  <T>(params: Omit<Params, 'url'>) =>
    fetchChain<T>({ url, ...params });

    
export function fetchChainBatch<T extends Array<any>>(
  params: Pick<Params, 'key' | 'options' | 'responseHandler' | 'throttle' | 'url'> & { rpcs: Array<Pick<Params, 'method' | 'params'>> },
): Promise<T>;
export function fetchChainBatch<T extends object>(
  params: Pick<Params, 'key' | 'options' | 'responseHandler' | 'throttle' | 'url'> & { rpcs: Record<string, Pick<Params, 'method' | 'params'>> },
): Promise<T>;
export function fetchChainBatch<T>({
  key,
  options,
  responseHandler,
  throttle,
  url,
  rpcs,
}: Pick<Params, 'key' | 'options' | 'responseHandler' | 'throttle' | 'url'> & {
  rpcs: Record<string, Pick<Params, 'method' | 'params'>> | Array<Pick<Params, 'method' | 'params'>>;
}) {
  const json: Array<Pick<Params, 'method' | 'params'> & { jsonrpc: string }> = [];
  if (Array.isArray(rpcs) || rpcs instanceof Object) {
    const arr = Array.isArray(rpcs) ? rpcs : Object.values(rpcs);
    arr.forEach((rpc) => {
      json.push({
        jsonrpc: '2.0',
        method: rpc?.method ?? (url.includes('test.confluxrpc.com') || url.includes('main.confluxrpc.com') ? 'cfx_call' : 'eth_call'),
        params: rpc?.params,
      });
    });
  } else {
    throw new Error('Invalid rpcs');
  }

  const currentId = id + 1;
  const jsonWithId = json.map((item) => ({ ...item, id: ++id }));

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
          const res = _res as Array<{ id: number; result: any; jsonrpc: string; error: { code: number; message: string } }>;

          const result = res.map((item, index) => {
            if (currentId + index === item?.id) {
              if (item?.error) {
                return item.error;
              }
              if (isFunction(responseHandler)) {
                return responseHandler(item?.result);
              }
              return item?.result;
            } else {
              return { code: -9999, message: 'invalid id' };
            }
          });

          if (Array.isArray(rpcs)) {
            return result as unknown as T;
          } else {
            return Object.fromEntries(Object.keys(rpcs).map((key, index) => [key, result[index]])) as unknown as T;
          }
        }),
  });
}

interface FetchChainMulticallParams {
  url: string;
  method?: 'cfx_call' | 'eth_call';
  multicallContractAddress: string;
}
interface Data {
  contractAddress: string;
  encodedData: string;
  decodeFunc: (res: string) => any;
}
type ReturnTypeOfDecodeFunc<T> = T extends Data & { decodeFunc: (res: string) => infer R } ? (R extends readonly [infer U] ? U : R) : unknown;

export const fetchChainMulticall = <T extends Array<Data> | Record<string, Data>>({
  url,
  method,
  multicallContractAddress,
  data,
}: FetchChainMulticallParams & { data: T }) => {
  const multicallContract = createMulticallContract(multicallContractAddress);
  const _method = method ?? (url.includes('test.confluxrpc.com') || url.includes('main.confluxrpc.com') ? 'cfx_call' : 'eth_call');

  let _data: Array<Data>;
  if (Array.isArray(data) || data instanceof Object) {
    _data = Array.isArray(data) ? data : Object.values(data);
  } else {
    throw new Error('Invalid data');
  }

  return fetchChain({
    url,
    method: _method,
    params: [
      {
        to: multicallContractAddress,
        data: multicallContract.encodeFunctionData('aggregate', [_data.map((item) => [item.contractAddress, item.encodedData]) as any]),
      },
      _method === 'cfx_call' ? 'latest_state' : 'latest',
    ],
  }).then((_res) => {
    const res = multicallContract.decodeFunctionResult('aggregate', _res as string) as [bigint, string[]];
    const result = res?.[1]?.map((item, index) => {
      const itemRes = typeof _data[index]?.decodeFunc === 'function' ? _data[index]?.decodeFunc(item) : undefined;
      if (Array.isArray(itemRes) && itemRes.length === 1) {
        return itemRes[0];
      }
      return itemRes;
    });

    if (Array.isArray(data)) {
      return result as unknown as { [K in keyof T]: ReturnTypeOfDecodeFunc<T[K]> };
    } else {
      return Object.fromEntries(Object.keys(data).map((key, index) => [key, result[index]])) as unknown as { [K in keyof T]: ReturnTypeOfDecodeFunc<T[K]> };
    }
  });
};

export const createFetchChainMulticall =
  ({ url, method, multicallContractAddress }: Pick<FetchChainMulticallParams, 'url' | 'method' | 'multicallContractAddress'>) =>
  <T extends Array<Data> | Record<string, Data>>(params: Omit<FetchChainMulticallParams, 'url' | 'method' | 'multicallContractAddress'> & { data: T }) =>
    fetchChainMulticall<T>({
      url,
      method: method ?? (url.includes('test.confluxrpc.com') || url.includes('main.confluxrpc.com') ? 'cfx_call' : 'eth_call'),
      multicallContractAddress,
      ...params,
    });
