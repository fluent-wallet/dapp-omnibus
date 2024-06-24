import { MutableRefObject, useEffect } from 'react';

type RefObject = MutableRefObject<HTMLElement | null>;

export const useClickAway = (refs: RefObject | Array<RefObject>, handler: (event: Event) => void) => {
  useEffect(() => {
    const callback = (event: Event) => {
      const refsArray = Array.isArray(refs) ? refs : [refs];
      let isAway = true;
      for (let i = 0; i < refsArray.length; i++) {
        const el = refsArray[i].current;
        if (!event || !el || el.contains(event.target as HTMLElement)) {
          isAway = false;
          break;
        }
      }
      if (isAway) {
        handler(event);
      }
    };

    document.addEventListener('click', callback);
    return () => document.removeEventListener('click', callback);
  }, [refs, handler]);
};
