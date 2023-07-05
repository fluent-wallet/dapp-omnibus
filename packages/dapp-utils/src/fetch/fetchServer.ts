/* eslint-disable @typescript-eslint/ban-types */
import ky, { Options } from 'ky';
import { fetchBase } from './utils';
import { isFunction } from '@cfx-kit/utils/src/is';

interface FetchParams {
  url: string;
  options?: Options;
  key?: string;
  throttle?: false | number;
}

export const createFetchServer = ({
  prefixUrl,
  handler,
  getHandler,
  postHandler,
}: {
  prefixUrl?: string;
  handler?: Function;
  getHandler?: Function;
  postHandler?: Function;
}) => {
  const original = ky.create({
    prefixUrl,
  });

  const postServer = async <T, D>(url: string, data: object): Promise<T> =>
    original
      .post(url, { json: data })
      .json()
      .then((_res: unknown) => {
        if (isFunction(postHandler)) {
          return postHandler(_res as unknown as D) as T;
        } else if (isFunction(handler)) {
          return handler(_res as unknown as D) as T;
        }
        return _res as T;
      });

  const fetchServer = async <T, D>({ url, key, throttle, options }: FetchParams): Promise<T> => {
    return fetchBase({
      key: key ?? url,
      throttle,
      fetcher: () =>
        ky
          .get(url, options)
          .json()
          .then((_res: unknown) => {
            if (isFunction(getHandler)) {
              return getHandler(_res as unknown as D) as T;
            } else if (isFunction(handler)) {
              return handler(_res as unknown as D) as T;
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
