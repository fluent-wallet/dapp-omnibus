import { isEqual } from 'lodash-es';
const lastCache = new Map<string, { timestamp: number | null; data: unknown }>();
const promiseCache = new Map<string, Promise<unknown>>();

/**
 * 
 * @param param0 
 * @returns 
 */
export async function fetchBase<T>({ key, throttle = 250, fetcher }: { key: string; throttle?: false | number; fetcher: () => Promise<T> }): Promise<T> {
  const hasLastCache = lastCache.has(key);
  const lastCacheRes = lastCache.get(key) as { timestamp: number; data: T };

  const { timestamp, data: lastData } = lastCacheRes ?? { timestamp: null, data: null };
  if (throttle && timestamp && hasLastCache && Date.now() - timestamp < throttle) {
    return lastData;
  }

  const promiseInProgress = promiseCache.get(key) as Promise<T>;
  let usedPromise: Promise<T>;
  if (promiseInProgress) {
    usedPromise = promiseInProgress;
  } else {
    usedPromise = fetcher();
    promiseCache.set(key, usedPromise);
    usedPromise.finally(() => {
      promiseCache.delete(key);
    });
  }

  const newData = await usedPromise;
  if (hasLastCache && isEqual(lastData, newData)) {
    lastCache.set(key, { timestamp: Date.now(), data: lastData });
    return lastData;
  } else {
    lastCache.set(key, { timestamp: Date.now(), data: newData });
    return newData;
  }
}

export const getCacheData = <T>(key: string) => lastCache.get(key)?.data as T;
