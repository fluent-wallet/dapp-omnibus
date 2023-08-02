import { type FC } from 'react';
import Pagination from '@cfx-kit/ui-components/src/Pagination';

const App: FC = () => {
  return (
    <>
      <Pagination count={500} pageSize={10} page={1}/>
    </>
  );
};

export default App;
