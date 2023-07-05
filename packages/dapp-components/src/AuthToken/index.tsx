import { type FC } from 'react';

interface Props {
  primary?: boolean;
  size?: 'small' | 'large';
  label?: string;
}

const Button: FC<Props> = ({ primary = false, label = 'Boop', size = 'small' }) => {
  return (
    <button
      style={{
        backgroundColor: primary ? 'red' : 'blue',
        fontSize: size === 'large' ? '24px' : '14px',
      }}
    >
      {label}
    </button>
  );
};

export default Button;
