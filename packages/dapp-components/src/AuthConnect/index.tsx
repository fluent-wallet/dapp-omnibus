import React, { type ComponentProps } from 'react';

interface Props extends ComponentProps<'div'> {
  qwe: number;
}

const Accordion: React.FC<Props> = () => {
  return <div>234</div>;
};

export default Accordion;
