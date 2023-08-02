import { useEffect, useId, forwardRef, type ComponentProps, type ReactNode, type HTMLAttributes, type CSSProperties } from 'react';
import { machine, connect } from '@zag-js/switch';
import { useMachine, normalizeProps } from '@zag-js/react';
import './index.css';

interface Props extends Omit<ComponentProps<'label'>, 'children' | 'onChange'> {
  id?: string;
  children?: ReactNode | undefined | (({ labelProps, isChecked }: { labelProps: HTMLAttributes<HTMLElement>; isChecked: boolean }) => JSX.Element);
  labelPlacement?: 'start' | 'end';
  controllerClassName?: string;
  controllerStyle?: CSSProperties;
  thumbClassName?: string;
  thumbStyle?: CSSProperties;
  disabled?: boolean;
  readOnly?: boolean;
  checked?: boolean;
  defaultChecked?: boolean;
  name?: string;
  form?: string;
  required?: boolean;
  invalid?: boolean;
  onChange?: (details: { checked: boolean }) => void;
}

const Switch = forwardRef<HTMLInputElement, Props>(
  (
    {
      id,
      labelPlacement = 'end',
      controllerClassName,
      controllerStyle,
      thumbClassName,
      thumbStyle,
      children,
      disabled,
      readOnly,
      checked,
      defaultChecked,
      onChange,
      name,
      form,
      required,
      invalid,
      className,
      ...props
    },
    _forwardRef,
  ) => {
    const uniqueId = useId();
    const [state, send] = useMachine(machine({ id: id ?? uniqueId, disabled, readOnly, checked: defaultChecked, name, form, required, invalid, onChange }));
    const api = connect(state, send, normalizeProps);

    useEffect(() => {
      if (typeof checked === 'boolean') {
        api.setChecked(checked);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [checked]);

    return (
      <label className={`ui-switch${className ? ` ${className}` : ''}`} {...api.rootProps} {...props}>
        <input {...api.inputProps} ref={_forwardRef} />
        {!!children &&
          labelPlacement === 'start' &&
          (typeof children === 'function' ? children({ labelProps: api.labelProps, isChecked: api.isChecked }) : children)}
        <span className={`ui-switch-controller${controllerClassName ? ` ${controllerClassName}` : ''}`} style={controllerStyle} {...api.controlProps}>
          <span className={`ui-switch-thumb${thumbClassName ? ` ${thumbClassName}` : ''}`} style={thumbStyle} {...api.thumbProps} />
        </span>

        {!!children &&
          labelPlacement === 'end' &&
          (typeof children === 'function' ? children({ labelProps: api.labelProps, isChecked: api.isChecked }) : children)}
      </label>
    );
  },
);

export default Switch;
