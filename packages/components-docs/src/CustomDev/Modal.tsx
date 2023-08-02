import { useState, type FC } from 'react';
import Modal from '@cfx-kit/ui-components/src/Modal';

const App: FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>open</button>
      <Modal open={open}>
        <button onClick={() => setOpen(false)}>close</button>
      </Modal>

      <button onClick={() => setOpen(true)}>trigger</button>
      <Modal open={open}>
        {({ contentProps }) => (
          <div {...contentProps}>
            <button onClick={() => setOpen(false)}>close</button>
            内容区域
          </div>
        )}
      </Modal>

      <Modal trigger={({ triggerProps }) => <button {...triggerProps}>trigger</button>}>
        {({ contentProps, closeTriggerProps }) => (
          <div {...contentProps}>
            <button {...closeTriggerProps}>close</button>
            内容区域
          </div>
        )}
      </Modal>

      <Modal trigger={({ triggerProps }) => <button {...triggerProps}>trigger</button>}>
        <div className="">内容区域</div>
      </Modal>

      <Modal trigger={({ triggerProps }) => <button {...triggerProps}>trigger</button>}>
        <div>内容区域1</div>
        <div>内容区域2</div>
      </Modal>
    </>
  );
};

export default App;
