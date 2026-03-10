import type { ProductStatus } from '@repo/contracts/types/enums/enums';

const ProductTextMapping: Record<ProductStatus, string> = {
  AVAILABLE: 'Available',
  OUT_OF_STOCK: 'Out of Stock',
  DISCONTINUED: 'Discontinued',
};

export default ProductTextMapping;
