import { type FC } from 'react';
import Select from '@cfx-kit/ui-components/src/Select';

const options = [
  { label: 'Nigeria', value: 'NG' },
  { label: 'Japan', value: 'JP' },
  { label: 'Korea', value: 'KO' },
  { label: 'Kenya', value: 'KE' },
  { label: 'United Kingdom', value: 'UK' },
  { label: 'Ghana', value: 'GH' },
  { label: 'Uganda', value: 'UG' },
];

const App: FC = () => {
  return (
    <>
      <Select
        options={options}
        trigger={({ triggerProps, selectedOption }) => (
          <button type="button" {...triggerProps}>
            <span>{selectedOption?.label ?? 'Select option'}</span>
          </button>
        )}
      />

      <Select
        options={options}
        trigger={({ triggerProps, selectedOption }) => (
          <button type="button" {...triggerProps}>
            <span>{selectedOption?.label ?? 'Select option'}</span>
          </button>
        )}
        contentStyle={{ borderRadius: '12px', overflow: 'hidden' }}
        optionStyle={{ backgroundColor: 'red ' }}
      />

      <Select
        options={options}
        trigger={({ triggerProps, selectedOption }) => (
          <button type="button" {...triggerProps}>
            <span>{selectedOption?.label ?? 'Select option'}</span>
          </button>
        )}
        contentStyle={{ borderRadius: '12px', overflow: 'hidden' }}
        renderOption={({ option, getOptionProps }) => (
          <div key={option.value} {...getOptionProps(option)}>
            {option.label} ✅
          </div>
        )}
      />

      <Select
        options={options}
        trigger={({ triggerProps, selectedOption }) => (
          <button type="button" {...triggerProps}>
            <span>{selectedOption?.label ?? 'Select option'}</span>
          </button>
        )}
      >
        {({ contentProps, getOptionProps, selectedOption }) => (
          <div {...contentProps}>
            {options.map((option) => (
              <div key={option.value} {...getOptionProps(option)}>
                {option.label} {selectedOption?.value === option.value ? '✅' : '❌'}
              </div>
            ))}
          </div>
        )}
      </Select>
    </>
  );
};

export default App;
