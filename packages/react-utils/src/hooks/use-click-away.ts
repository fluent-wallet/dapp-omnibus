import { MutableRefObject, useEffect } from 'react';

type RefObject = MutableRefObject<HTMLElement | null>;

export const useClickAway = (refs: RefObject | Array<RefObject>, handler: (event: Event) => void) => {
  useEffect(() => {
    const callback = (event: MouseEvent) => {
      let refsArray = Array.isArray(refs) ? refs : [refs];
      let isAway = true;
      while (refsArray.length) {
        const el = refsArray[0].current;
        if (!event || !el || el.contains(event.target as HTMLElement)) {
          isAway = false;
          refsArray = [];
        }
        refsArray.shift();
      }
      if (isAway) {
        handler(event);
      }
    };

    document.addEventListener('click', callback);
    return () => document.removeEventListener('click', callback);
  }, [refs, handler]);
};
