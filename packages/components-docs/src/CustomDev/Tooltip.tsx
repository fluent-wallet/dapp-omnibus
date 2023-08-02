import { type FC } from 'react';
  import Tooltip from '@cfx-kit/ui-components/src/Tooltip';

const App: FC = () => {
  return (
    <>
      <Tooltip trigger={({ triggerProps }) => <button {...triggerProps}>trigger</button>}>
        <div>tooltip</div>
      </Tooltip>
    </>
  );
};

export default App;
