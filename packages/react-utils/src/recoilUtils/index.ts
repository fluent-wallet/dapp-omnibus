/* eslint-disable @typescript-eslint/no-explicit-any */
import { type AtomEffect, type MutableSnapshot } from 'recoil';
import { LocalStorageClass } from 'localstorage-enhance';
const RecoilPersistLocalStorage = new LocalStorageClass({ storageKey: 'recoil_persist_localStorage', capacity: 1500 });
export * from './useAutoRefreshData';

export const persistAtom: AtomEffect<any> = ({ setSelf, onSet, trigger, node: { key } }) => {
  if (trigger === 'get') {
    setSelf(RecoilPersistLocalStorage.getItem(key));
  }

  onSet((data) => {
    RecoilPersistLocalStorage.setItem({ key, data });
  });
};

export const persistAtomWithNamespace =
  (namespace: string): AtomEffect<any> =>
  ({ setSelf, onSet, trigger, node: { key } }) => {
    if (trigger === 'get') {
      setSelf(RecoilPersistLocalStorage.getItem(key, namespace));
    }

    onSet((data) => {
      RecoilPersistLocalStorage.setItem({ key, data, namespace });
    });
  };

export const persistAtomWithDefault =
  (defaultValue: any): AtomEffect<any> =>
  ({ setSelf, onSet, node: { key } }) => {
    setSelf(RecoilPersistLocalStorage.getItem(key) ?? defaultValue);

    onSet((data) => {
      RecoilPersistLocalStorage.setItem({ key, data });
    });
  };

let initCallback: Array<(set: MutableSnapshot['set']) => void> | null = [];
export const handleRecoilInit = (callback: (set: MutableSnapshot['set']) => void) => {
  if (!initCallback) throw new Error('Recoil init callback has been called');
  initCallback.push(callback);
};

export const initializeRecoil = (snapshot: MutableSnapshot) => {
  if (initCallback) {
    initCallback.forEach((callback) => callback?.(snapshot.set));
    initCallback = null;
  }
};
