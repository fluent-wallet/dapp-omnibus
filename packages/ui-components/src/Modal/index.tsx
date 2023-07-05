import { useId, isValidElement, cloneElement, Children, type HTMLAttributes, type ReactNode } from 'react';
import { machine, connect } from '@zag-js/dialog';
import { useMachine, normalizeProps, Portal } from '@zag-js/react';
import './index.css';

interface Props {
  id?: string;
  open?: boolean;
  closeOnEsc?: boolean;
  closeOnOutsideClick?: boolean;
  modal?: boolean;
  preventScroll?: boolean;
  trapFocus?: boolean;
  backdropClassName?: string;
  containerClassName?: string;
  onOpen?: VoidFunction;
  onClose?: VoidFunction;
  children?:
    | (({ contentProps, closeTriggerProps }: { contentProps: HTMLAttributes<HTMLElement>; closeTriggerProps: HTMLAttributes<HTMLElement> }) => JSX.Element)
    | ReactNode;
  trigger?: (triggerProps: HTMLAttributes<HTMLElement>) => JSX.Element;
}

const Modal: React.FC<Props> = ({
  id,
  closeOnEsc = true,
  closeOnOutsideClick = false,
  modal = true,
  preventScroll = true,
  trapFocus = true,
  children,
  backdropClassName,
  containerClassName,
  trigger,
  ...props
}) => {
  const uniqueId = useId();
  const [state, send] = useMachine(machine({ id: id ?? uniqueId, closeOnEsc, closeOnOutsideClick, modal, preventScroll, trapFocus, ...props }));
  const api = connect(state, send, normalizeProps);

  return (
    <>
      {typeof trigger === 'function' ? trigger(api.triggerProps) : null}
      {api.isOpen && (
        <Portal>
          {modal && <div className={backdropClassName} {...api.backdropProps} />}
          <div className={containerClassName} {...api.containerProps}>
            {typeof children === 'function' && children({ contentProps: api.contentProps, closeTriggerProps: api.closeTriggerProps })}
            {typeof children !== 'function' ? (
              Children.count(children) === 1 && isValidElement(children) ? (
                cloneElement(children, { ...api.contentProps })
              ) : (
                <div {...api.contentProps}>{children}</div>
              )
            ) : null}
          </div>
        </Portal>
      )}
    </>
  );
};

export { Portal } from '@zag-js/react';
export default Modal;
