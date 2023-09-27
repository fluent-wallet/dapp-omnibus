import { useEffect, useId, isValidElement, cloneElement, Children, type HTMLAttributes, type ReactNode } from 'react';
import { machine, connect, type PositioningOptions } from '@zag-js/tooltip';
import { useMachine, normalizeProps } from '@zag-js/react';
import './index.css';

interface Props {
  id?: string;
  open?: boolean;
  openDelay?: number;
  closeDelay?: number;
  closeOnPointerDown?: boolean;
  closeOnEscape?: boolean;
  arrow?: boolean;
  interactive?: boolean;
  positioning?: PositioningOptions;
  onOpen?: VoidFunction;
  onClose?: VoidFunction;
  containerClassName?: string;
  children?: (({ contentProps }: { contentProps: HTMLAttributes<HTMLElement> }) => JSX.Element) | ReactNode;
  trigger?: ({ triggerProps }: { triggerProps: Omit<HTMLAttributes<HTMLElement>, 'color'> }) => JSX.Element;
}

const Tooltip: React.FC<Props> = ({
  id,
  open = false,
  openDelay = 200,
  closeDelay = 200,
  arrow = true,
  positioning,
  children,
  containerClassName,
  trigger,
  ...props
}) => {
  const uniqueId = useId();
  const [state, send] = useMachine(machine({ id: id ?? uniqueId, openDelay, closeDelay, positioning, ...props }));
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
        <div className={`ui-tooltip${containerClassName ? ` ${containerClassName}` : ''}`} {...api.positionerProps}>
          {arrow && (
            <div {...api.arrowProps}>
              <div {...api.arrowTipProps} />
            </div>
          )}
          {typeof children === 'function' && children({ contentProps: api.contentProps })}
          {typeof children !== 'function' ? (
            Children.count(children) === 1 && isValidElement(children) ? (
              cloneElement(children, { ...api.contentProps })
            ) : (
              <div {...api.contentProps}>{children}</div>
            )
          ) : null}
        </div>
      )}
    </>
  );
};

export type { PositioningOptions } from '@zag-js/tooltip';
export default Tooltip;
