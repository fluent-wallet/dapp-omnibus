import { type FC } from 'react';
import { useToast, type RenderOptions } from '@cfx-kit/ui-components/src/Toast';

const render: FC<RenderOptions> = ({ type, dismiss }: RenderOptions) => {
  return (
    <div style={{ background: 'red' }}>
      <div>My custom toast</div>
      <button onClick={dismiss}>close</button>
    </div>
  );
};

const App: FC = () => {
  const toast = useToast();

  return (
    <div>
      <button
        onClick={() => {
          toast.create({ title: 'Hello', placement: 'top-end', render });
        }}
      >
        Add top-right toast
      </button>
      <button
        onClick={() => {
          toast.create({
            title: 'Data submitted!',
            type: 'success',
            placement: 'bottom-end',
          });
        }}
      >
        Add bottom-right toast
      </button>
    </div>
  );
};

export default App;
