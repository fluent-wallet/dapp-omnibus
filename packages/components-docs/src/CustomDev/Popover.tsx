import { type FC } from 'react';
import Popover from '@cfx-kit/ui-components/src/Popover';

const App: FC = () => {
  return (
    <>
      <Popover trigger={({ triggerProps }) => <button {...triggerProps}>trigger</button>}>
        <div>Popover</div>
      </Popover>
    </>
  );
};

export default App;
