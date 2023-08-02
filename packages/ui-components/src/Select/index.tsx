import { useId, useMemo, useEffect, cloneElement, forwardRef, type HTMLAttributes, type CSSProperties } from 'react';
import { machine, connect, type PublicApi, type Context } from '@zag-js/select';
import { useMachine, normalizeProps, Portal } from '@zag-js/react';
import './index.css';

export interface Option {
  label: string;
  value: string;
}

interface Props {
  options: Array<Option>;
  closeOnSelect?: boolean;
  id?: string;
  disabled?: boolean;
  readOnly?: boolean;
  name?: string;
  form?: string;
  required?: boolean;
  invalid?: boolean;
  children?:
    | (({
        contentProps,
        getOptionProps,
      }: {
        contentProps: HTMLAttributes<HTMLElement>;
        getOptionProps: PublicApi['getOptionProps'];
        selectedOption: PublicApi['selectedOption'];
      }) => JSX.Element)
    | undefined
    | never
    | never[];
  onChange?: Context['onChange'];
  contentClassName?: string;
  contentStyle?: CSSProperties;
  renderContent?: ({ contentProps }: { contentProps: HTMLAttributes<HTMLElement>; selectedOption: PublicApi['selectedOption'] }) => JSX.Element;
  optionClassName?: string;
  optionStyle?: CSSProperties;
  renderOption?: ({
    index,
    option,
    getOptionProps,
  }: {
    index: number;
    option: { label: string; value: string };
    getOptionProps: PublicApi['getOptionProps'];
    selectedOption: PublicApi['selectedOption'];
  }) => JSX.Element;
  trigger?: ({
    triggerProps,
    selectedOption,
    isOpen,
  }: {
    triggerProps: HTMLAttributes<HTMLElement>;
    selectedOption: PublicApi['selectedOption'];
    isOpen: PublicApi['isOpen'];
  }) => JSX.Element;
  defaultSelectedOption?: string;
}

const Select = forwardRef<HTMLSelectElement, Props>(
  (
    {
      id,
      options,
      closeOnSelect,
      children,
      disabled,
      readOnly,
      name,
      form,
      invalid,
      trigger,
      onChange,
      contentClassName,
      contentStyle,
      optionClassName,
      optionStyle,
      renderOption,
      renderContent,
      defaultSelectedOption,
    },
    _forwardRef,
  ) => {
    const uniqueId = useId();
    const [state, send] = useMachine(machine({ id: id ?? uniqueId, disabled, readOnly, name, form, invalid, closeOnSelect, onChange }));
    const api = connect(state, send, normalizeProps);
    useEffect(() => {
      const defaultOption = typeof defaultSelectedOption === 'string' ? options?.find((option) => option.value === defaultSelectedOption) : null;
      if (defaultOption) {
        api.setSelectedOption(defaultOption);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const contentElement = useMemo(
      () =>
        typeof children === 'function' ? null : typeof renderContent === 'function' ? (
          renderContent({ contentProps: api.contentProps, selectedOption: api.selectedOption })
        ) : (
          <div {...api.contentProps} className={contentClassName} style={contentStyle}></div>
        ),
      [api.contentProps, api.selectedOption, children, contentClassName, contentStyle, renderContent],
    );

    return (
      <>
        <select {...api.hiddenSelectProps} ref={_forwardRef}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {typeof trigger === 'function' ? trigger({ triggerProps: api.triggerProps, selectedOption: api.selectedOption, isOpen: api.isOpen }) : null}

        <Portal>
          <div {...api.positionerProps}>
            {typeof children === 'function' &&
              children({ contentProps: api.contentProps, getOptionProps: api.getOptionProps, selectedOption: api.selectedOption })}
            {!children &&
              contentElement &&
              cloneElement(contentElement, {
                children: options.map((option, index) =>
                  typeof renderOption === 'function' ? (
                    renderOption({ option, index, getOptionProps: api.getOptionProps, selectedOption: api.selectedOption })
                  ) : (
                    <div className={optionClassName} style={optionStyle} key={option?.value} {...api.getOptionProps(option)}>
                      {option?.label}
                    </div>
                  ),
                ),
              })}
          </div>
        </Portal>
      </>
    );
  },
);

export default Select;
