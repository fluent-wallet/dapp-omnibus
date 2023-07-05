export const isPromise = <T>(obj: unknown): obj is Promise<T> =>
  !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof (obj as Promise<unknown>)?.then === 'function';

// eslint-disable-next-line @typescript-eslint/ban-types
export const isFunction = (obj: unknown): obj is Function => typeof obj === 'function';

export const isNegative = (num: number): num is number => typeof num === 'number' && num < 0;

export const isOdd = (num: number) => num & 1;
export const isEven = (num: number) => !(num & 1);

export const isString = (str: string): str is string => typeof str === 'string';

export const isDOMElement = (obj: HTMLElement): obj is HTMLElement => {
  try {
    return obj instanceof HTMLElement;
  } catch (e) {
    return typeof obj === 'object' && obj.nodeType === 1 && typeof obj.style === 'object' && typeof obj.ownerDocument === 'object';
  }
};

export const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

export const isLocalDev = location.host.startsWith('localhost') || location.host.startsWith('1');
