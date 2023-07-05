import React, { type ComponentProps } from 'react';

interface Props extends ComponentProps<'div'> {
  qwe: number;
}

const Accordion: React.FC<Props> = () => {
  return <div>123</div>;
};

export default Accordion;
