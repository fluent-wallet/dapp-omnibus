import { useEffect, useMemo, useId, isValidElement, cloneElement, Children, Fragment, type HTMLAttributes, type ReactNode } from 'react';
import { machine, connect, PositioningOptions } from '@zag-js/popover';
import { useMachine, normalizeProps, Portal } from '@zag-js/react';
import './index.css';

interface Props {
  id?: string;
  open?: boolean;
  arrow?: boolean;
  portalled?: boolean;
  closeOnEsc?: boolean;
  closeOnInteractOutside?: boolean;
  positioning?: PositioningOptions;
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
  trigger?: ({ triggerProps, isOpen }: { triggerProps: Omit<HTMLAttributes<HTMLElement>, 'color'>; isOpen: boolean }) => JSX.Element;
}

const Popover: React.FC<Props> = ({
  id,
  open,
  closeOnEsc = true,
  closeOnInteractOutside = true,
  arrow = false,
  children,
  containerClassName,
  trigger,
  ...props
}) => {
  const uniqueId = useId();
  const [state, send] = useMachine(machine({ id: id ?? uniqueId, closeOnEsc, closeOnInteractOutside, ...props }));
  const api = connect(state, send, normalizeProps);
  const Wrapper = useMemo(() => (api.portalled ? Portal : Fragment), [api.portalled]);

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
      {typeof trigger === 'function' ? trigger({ triggerProps: api.triggerProps, isOpen: api.isOpen }) : null}
      {api.isOpen && (
        <Wrapper>
          <div className={`ui-popover${containerClassName ? ` ${containerClassName}` : ''}`} {...api.positionerProps}>
            {arrow && (
              <div {...api.arrowProps}>
                <div {...api.arrowTipProps} />
              </div>
            )}

            {typeof children === 'function' && children({ contentProps: api.contentProps, closeTriggerProps: api.closeTriggerProps, close: api.close })}
            {typeof children !== 'function' ? (
              Children.count(children) === 1 && isValidElement(children) ? (
                cloneElement(children, { ...api.contentProps })
              ) : (
                <div {...api.contentProps}>{children}</div>
              )
            ) : null}
          </div>
        </Wrapper>
      )}
    </>
  );
};

export type { PositioningOptions } from '@zag-js/popover';
export default Popover;
