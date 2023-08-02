import { useEffect, useId, forwardRef, type ComponentProps, type ReactNode, type HTMLAttributes, type CSSProperties } from 'react';
import { machine, connect, type CheckedState } from '@zag-js/checkbox';
import { useMachine, normalizeProps } from '@zag-js/react';
import './index.css';
import { default as defaultMarker } from './defaultMarker';

interface Props extends Omit<ComponentProps<'label'>, 'children' | 'onChange'> {
  id?: string;
  children?: ReactNode | undefined | (({ labelProps, isChecked }: { labelProps: HTMLAttributes<HTMLElement>; isChecked: boolean }) => JSX.Element);
  labelPlacement?: 'start' | 'end';
  controllerClassName?: string;
  controllerStyle?: CSSProperties;
  disabled?: boolean;
  checked?: boolean;
  defaultChecked?: boolean;
  name?: string;
  form?: string;
  required?: boolean;
  invalid?: boolean;
  onChange?: (details: { checked: CheckedState }) => void;
  marker?: ReactNode | (() => JSX.Element);
}

const Checkbox = forwardRef<HTMLInputElement, Props>(
  (
    {
      id,
      labelPlacement = 'end',
      controllerClassName,
      controllerStyle,
      children,
      disabled,
      checked,
      defaultChecked,
      onChange,
      name,
      form,
      required,
      invalid,
      className,
      marker = defaultMarker,
      ...props
    },
    _forwardRef,
  ) => {
    const uniqueId = useId();
    const [state, send] = useMachine(machine({ id: id ?? uniqueId, disabled, checked: defaultChecked, name, form, required, invalid, onChange }));
    const api = connect(state, send, normalizeProps);

    useEffect(() => {
      if (typeof checked === 'boolean') {
        api.setChecked(checked);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [checked]);

    return (
      <label className={`ui-checkbox${className ? ` ${className}` : ''}`} {...api.rootProps} {...props}>
        <input {...api.hiddenInputProps} ref={_forwardRef} />
        {!!children &&
          labelPlacement === 'start' &&
          (typeof children === 'function' ? children({ labelProps: api.labelProps, isChecked: api.isChecked }) : children)}
        <div className={`ui-checkbox-controller${controllerClassName ? ` ${controllerClassName}` : ''}`} style={controllerStyle} {...api.controlProps}>
          {typeof marker === 'function' ? marker() : marker}
        </div>
        {!!children &&
          labelPlacement === 'end' &&
          (typeof children === 'function' ? children({ labelProps: api.labelProps, isChecked: api.isChecked }) : children)}
      </label>
    );
  },
);

export default Checkbox;
