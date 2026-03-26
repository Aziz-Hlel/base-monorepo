import { SelectedRowProvider } from './context/selected-row-provider';
import Main from './Main';

const Products2Index = () => {
  return (
    <SelectedRowProvider>
      <Main />
    </SelectedRowProvider>
  );
};

export default Products2Index;
