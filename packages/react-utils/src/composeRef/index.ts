import { type MutableRefObject, type RefCallback } from 'react';
function composeRef<T>(refs: Array<MutableRefObject<T | null> | RefCallback<T>>): React.RefCallback<T> {
  return (value) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(value);
      } else if (ref !== null) {
        ref.current = value;
      }
    });
  };
}
export default composeRef;
