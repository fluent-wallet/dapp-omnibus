import { type FC } from 'react';
import Accordion from '@cfx-kit/ui-components/src/Accordion';

const data = [
  { title: 'Watercraft', content: 'Sample accordion content' },
  { title: 'Automobiles', content: 'Sample accordion content' },
  { title: 'Aircrafts', content: 'Sample accordion content' },
];

const App: FC = () => {
  return (
    <>
      <Accordion>
        {({ getItemProps, getTriggerProps, getContentProps }) =>
          data.map((item) => (
            <div {...getItemProps({ value: item.title })}>
              <h3>
                <button {...getTriggerProps({ value: item.title })}>{item.title}</button>
              </h3>
              <div {...getContentProps({ value: item.title })}>{item.content}</div>
            </div>
          ))
        }
      </Accordion>
    </>
  );
};

export default App;
