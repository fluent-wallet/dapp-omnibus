async function* poll<T>(fetcher: () => Promise<T>, interval: number): AsyncGenerator<T> {
  while (true) {
    try {
      const result = await fetcher();
      if (result != undefined) {
        yield result;
      }
    } catch (err) {
      // console.error('Error in fetcher:', err);
      // break;
    }
    await new Promise((resolve) => setTimeout(resolve, interval));
  }
}

const asyncResultCache = new Map<string, ReturnType<typeof waitAsyncResult>>();
const waitAsyncResult = <T>({
  fetcher,
  maxWaitTime = 60,
  interval = 3,
  key,
}: {
  fetcher: () => Promise<T>;
  maxWaitTime: number;
  interval: number;
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
    for await (const result of poll(fetcher, interval * 1000)) {
      if (result != undefined) {
        status = 'fullfilled';
        resolve(result);
      }
      if (Date.now() > endTime) {
        status = 'rejected';
        reject(new Error('Wait async timeout'));
        if (typeof key === 'string' && !!key) {
          asyncResultCache.delete(key);
        }
        break;
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
