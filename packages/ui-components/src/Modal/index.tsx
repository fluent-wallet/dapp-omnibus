import { useEffect, useId, isValidElement, cloneElement, Children, type HTMLAttributes, type ReactNode } from 'react';
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
    | (({
        contentProps,
        closeTriggerProps,
        close,
      }: {
        contentProps: HTMLAttributes<HTMLElement>;
        closeTriggerProps: HTMLAttributes<HTMLElement>;
        close: VoidFunction;
      }) => JSX.Element)
    | ReactNode;
  trigger?: ({ triggerProps }: { triggerProps: Omit<HTMLAttributes<HTMLElement>, 'color'> }) => JSX.Element;
}

const Modal: React.FC<Props> = ({
  id,
  open,
  closeOnEsc,
  closeOnOutsideClick,
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
  const [state, send] = useMachine(
    machine({
      id: id ?? uniqueId,
      closeOnEsc: typeof closeOnEsc === 'boolean' ? closeOnEsc : typeof open === 'boolean' ? false : true,
      closeOnOutsideClick: typeof closeOnOutsideClick === 'boolean' ? closeOnOutsideClick : typeof open === 'boolean' ? false : true,
      modal,
      preventScroll,
      trapFocus,
      ...props,
    }),
  );
  const api = connect(state, send, normalizeProps);

  useEffect(() => {
    if (open === true) {
      api.open();
    } else {
      api.close();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <>
      {typeof trigger === 'function' ? trigger({ triggerProps: api.triggerProps }) : null}
      {api.isOpen && (
        <Portal>
          {modal && <div className={`ui-modal-backdrop${backdropClassName ? ` ${backdropClassName}` : ''}`} {...api.backdropProps} />}
          <div className={`ui-modal${containerClassName ? ` ${containerClassName}` : ''}`} {...api.containerProps}>
            {typeof children === 'function' && children({ contentProps: api.contentProps, closeTriggerProps: api.closeTriggerProps, close: api.close })}
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

export default Modal;
