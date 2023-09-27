import { useId, forwardRef, type ComponentProps } from 'react';
import { machine, connect, type Api } from '@zag-js/accordion';
import { useMachine, normalizeProps } from '@zag-js/react';

interface Props extends Omit<ComponentProps<'div'>, 'children'> {
  id?: string;
  multiple?: boolean;
  collapsible?: boolean;
  disabled?: boolean;
  children?: ({
    getItemProps,
    getTriggerProps,
    getContentProps,
  }: {
    getItemProps: Api['getItemProps'];
    getTriggerProps: Api['getTriggerProps'];
    getContentProps: Api['getContentProps'];
  }) => JSX.Element | Array<JSX.Element>;
}

const Accordion = forwardRef<HTMLDivElement, Props>(({ id, children, multiple, collapsible = true, disabled, ...props }, _forwardRef) => {
  const uniqueId = useId();
  const [state, send] = useMachine(machine({ id: id ?? uniqueId, multiple, collapsible, disabled }));
  const api = connect(state, send, normalizeProps);

  return (
    <div ref={_forwardRef} {...api.rootProps} {...props}>
      {typeof children !== 'function'
        ? null
        : children({ getItemProps: api.getItemProps, getTriggerProps: api.getTriggerProps, getContentProps: api.getContentProps })}
    </div>
  );
});

export default Accordion;
