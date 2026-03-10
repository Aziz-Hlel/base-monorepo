import { SelectedRowProvider } from './context/selected-row-provider';
import Main from './Main';

const Products2 = () => {
  return (
    <SelectedRowProvider>
      <Main />
    </SelectedRowProvider>
  );
};

export default Products2;
