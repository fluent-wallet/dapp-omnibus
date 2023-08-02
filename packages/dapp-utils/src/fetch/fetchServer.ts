/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import ky, { Options } from 'ky';
import { fetchBase, isFunction } from './utils';

interface FetchParams {
  url: string;
  options?: Options;
  key?: string;
  throttle?: false | number;
}

export const createFetchServer = ({
  prefixUrl,
  responseHandler,
  getHandler,
  postHandler,
}: {
  prefixUrl?: string;
  responseHandler?: Function;
  getHandler?: Function;
  postHandler?: Function;
}) => {
  const original = ky.create({
    prefixUrl,
  });

  const postServer = async <T, D = any>(url: string, data: object): Promise<T> =>
    original
      .post(url, { json: data })
      .json()
      .then((_res: unknown) => {
        if (isFunction(postHandler)) {
          return postHandler(_res as unknown as D) as T;
        } else if (isFunction(responseHandler)) {
          return responseHandler(_res as unknown as D) as T;
        }
        return _res as T;
      });

  const fetchServer = async <T, D = any>({ url, key, throttle, options }: FetchParams): Promise<T> => {
    return fetchBase({
      key: key ?? url,
      throttle,
      fetcher: () =>
        original
          .get(url, options)
          .json()
          .then((_res: unknown) => {
            if (isFunction(getHandler)) {
              return getHandler(_res as unknown as D) as T;
            } else if (isFunction(responseHandler)) {
              return responseHandler(_res as unknown as D) as T;
            }
            return _res as T;
          }),
    });
  };

  return {
    postServer,
    fetchServer,
  };
};
