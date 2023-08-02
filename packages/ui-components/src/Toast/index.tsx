import { useId, type PropsWithChildren } from 'react';
import { useActor, useMachine, normalizeProps, Portal } from '@zag-js/react';
import { connect, group, type Placement, type Service, type ToastOptions } from '@zag-js/toast';
import { ToastContext, type ToastContextProps } from './context';
export { useToast } from './context';
export type RenderOptions = Omit<ToastOptions, 'render'> & {
  dismiss(): void;
};

export interface Props {}

const Toast = ({ actor }: Props & { actor: Service }) => {
  const [state, send] = useActor(actor);
  const api = connect(state, send, normalizeProps);
  const jsx = api.render();

  if (jsx) {
    return <div {...api.rootProps}>{jsx}</div>;
  }

  return null;
};

export const ToastProvider: React.FC<PropsWithChildren<Props>> = ({ children }) => {
  const id = useId();
  const [state, send] = useMachine(group.machine({ id }));
  const api = group.connect(state, send, normalizeProps);

  return (
    <ToastContext.Provider value={api as ToastContextProps}>
      <Portal>
        {Object.entries(api.toastsByPlacement).map(([placement, toasts]) => (
          <div key={placement} {...api.getGroupProps({ placement: placement as Placement })}>
            {toasts.map((toast) => (
              <Toast key={toast.id} actor={toast} />
            ))}
          </div>
        ))}
      </Portal>
      {children}
    </ToastContext.Provider>
  );
};
