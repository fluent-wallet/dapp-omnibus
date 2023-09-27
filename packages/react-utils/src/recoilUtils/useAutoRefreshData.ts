import { useEffect, useLayoutEffect, useRef, startTransition } from 'react';
import { atomFamily, useRecoilState, useRecoilRefresher_UNSTABLE, useRecoilValueLoadable, type RecoilValue } from 'recoil';

const isPromise = <T>(obj: unknown): obj is Promise<T> =>
  !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof (obj as Promise<unknown>)?.then === 'function';
const keyMap = new Map<string, boolean>();

const inFetchAtom = atomFamily<boolean, string>({
  key: `inFetchAtom`,
  default: false,
});

const isInitPendingAtom = atomFamily<boolean, string>({
  key: `isInitPendingAtom`,
  default: true,
});

/**
 * This hooks is used to help the selector/selectorFamily that fetches remote data to automatically poll for updated data.
 * When use this hooks, you should use useRecoilValue_TRANSITION_SUPPORT_UNSTABLE instead of the useRecoilValue to subscribe to the selector/selectorFamily data,
 * otherwise the Suspense loading will be triggered every time the number is re-fetched.
 * This Hooks will run uniquely based on the key of the selector, so it can be used in multiple components with confidence.
 * This hooks may conflict with hot reload at local-dev, if return value { isPending, isInitPending } is always true, just try to refresh the page.
 * @date 2023/6/15 - 16:52:02
 *
 * @param { selector | selectorFamily } recoilValue - the recoil selector/selectorFamily that fetches remote data
 * @param {number} interval - Polling interval(ms)
 * @param {boolean} refreshImmediately - Whether to refresh immediately, Default is false.
 *                                       This parameter should be set to true when using the fetch method with useCache as 'init',
 *                                       i.e. the first fetch is from the local cache.
 * @param {() => Promise<T>} fetcher - Should be consistent with the get in selector/selectorFamily.
 *                                     This is an optional parameter, if not filled in,
 *                                     it will cause the components subscribed to the selector/selectorFamily to trigger a render every time refetch data.
 * @returns Return value
 * @property {boolean} isPending - True in refetch data.
 * @property {boolean} isInitPending - True for the first data refetch.
 * @property {number} refresh - Function for manually trigger refetch data
 */
export const useAutoRefreshData = <T>({
  recoilValue,
  interval = 15000,
  refreshImmediately = false,
  fetcher: _fetcher,
}: {
  recoilValue: RecoilValue<T>;
  fetcher?: () => Promise<T> | null | undefined;
  interval?: number;
  refreshImmediately?: boolean;
}) => {
  const refresh = useRecoilRefresher_UNSTABLE(recoilValue);
  const [inFetch, setInFetch] = useRecoilState(inFetchAtom(recoilValue.key));
  const { state, contents } = useRecoilValueLoadable(recoilValue);
  const [isInitPending, setIsInitPending] = useRecoilState(isInitPendingAtom(recoilValue.key));
  const isPending = inFetch || state === 'loading';

  useLayoutEffect(() => {
    const hasRunningAutoRefresh = keyMap.has(recoilValue.key);
    if (hasRunningAutoRefresh) return;
    setInFetch(refreshImmediately);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recoilValue.key]);

  useEffect(() => {
    if (isInitPending === false) {
      return;
    }
    if (isPending === false) {
      setIsInitPending(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPending]);

  const recoilValueRef = useRef<T | undefined>(undefined);
  useEffect(() => {
    recoilValueRef.current = contents as T;
  }, [contents]);

  useEffect(() => {
    const hasRunningAutoRefresh = keyMap.has(recoilValue.key);
    if (hasRunningAutoRefresh) return;
    keyMap.set(recoilValue.key, true);

    const fetcher = async () => {
      if (!_fetcher) return undefined;
      const p = _fetcher();
      if (isPromise(p)) {
        setInFetch(true);
        p.finally(() => setInFetch(false));
      }
      return p;
    };

    const exec = () => {
      if (fetcher) {
        fetcher()
          .then((res) => {
            if (res !== recoilValueRef.current) {
              startTransition(() => {
                refresh();
              });
            }
          })
          .catch(() => {});
      } else {
        startTransition(() => {
          refresh();
        });
      }
    };
    const timer = setInterval(exec, interval);
    if (refreshImmediately) {
      setTimeout(exec);
    }
    return () => {
      clearInterval(timer);
      keyMap.delete(recoilValue.key);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recoilValue.key, _fetcher, interval]);

  return {
    isInitPending,
    isPending,
    refresh,
  } as const;
};
