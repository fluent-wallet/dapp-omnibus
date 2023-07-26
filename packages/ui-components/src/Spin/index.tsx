import React, { type ComponentProps } from 'react';
import './index.css';

const Spin: React.FC<ComponentProps<'div'>> = ({ className }) => {
  return (
    <span className={`ui-spin-wrapper${className ? ` ${className}` : ''}`}>
      <svg className="ui-spin" viewBox="25 25 50 50">
        <circle className="ui-spin-path" cx="50" cy="50" r="20" fill="none" />
      </svg>
    </span>
  );
};

export default Spin;
