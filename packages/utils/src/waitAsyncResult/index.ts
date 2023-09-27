async function* poll<T>({ fetcher, interval, checkTimeout }: { fetcher: () => Promise<T>; interval: number; checkTimeout: () => boolean }): AsyncGenerator<T> {
  while (true) {
    try {
      const result = await fetcher();
      if (result !== undefined) {
        yield result;
        break;
      }
    } catch (err) {
      // console.error('Error in fetcher:', err);
      // break;
    }
    if (checkTimeout()) {
      break;
    }
    await new Promise((resolve) => setTimeout(resolve, interval * 1000));
  }
}

const asyncResultCache = new Map<string, ReturnType<typeof waitAsyncResult>>();
const waitAsyncResult = <T>({
  fetcher,
  maxWaitTime = 60,
  interval = 2,
  key,
}: {
  fetcher: () => Promise<T>;
  maxWaitTime?: number;
  interval?: number;
  key?: string;
}): Readonly<{
  promise: Promise<T>;
  stop: () => void;
  getStatus: () => 'fullfilled' | 'rejected' | 'pending';
}> => {
  if (typeof key === 'string' && !!key) {
    const cache = asyncResultCache.get(key);
    if (cache) {
      return cache as Readonly<{
        promise: Promise<T>;
        stop: () => void;
        getStatus: () => 'fullfilled' | 'rejected' | 'pending';
      }>;
    }
  }

  let status: 'fullfilled' | 'rejected' | 'pending' = 'pending';
  const getStatus = () => status;

  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });

  const endTime = Date.now() + maxWaitTime * 1000;

  (async () => {
    for await (const result of poll({
      fetcher,
      interval,
      checkTimeout: () => {
        if (maxWaitTime <= 0) return false;
        if (Date.now() > endTime) {
          status = 'rejected';
          reject(new Error('Wait async timeout'));
          if (typeof key === 'string' && !!key) {
            asyncResultCache.delete(key);
          }
          return true;
        } else {
          return false;
        }
      },
    })) {
      if (result !== undefined) {
        status = 'fullfilled';
        resolve(result);
      }
    }
  })();

  const ReturnVal = { promise, stop, getStatus } as const;

  if (typeof key === 'string' && !!key) {
    asyncResultCache.set(key, ReturnVal);
  }
  return ReturnVal;
};

export default waitAsyncResult;
