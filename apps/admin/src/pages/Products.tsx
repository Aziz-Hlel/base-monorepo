import { SelectedRowProvider } from '@/components/Products/context/selected-row-provider';
import ProductsIndex from '@/components/Products/Products.index';

const ProductPage = () => (
  <SelectedRowProvider>
    <ProductsIndex />
  </SelectedRowProvider>
);

export default ProductPage;
