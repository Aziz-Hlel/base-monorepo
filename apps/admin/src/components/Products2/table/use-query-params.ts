import { useSearchParams } from 'react-router-dom';
import { useMemo } from 'react';
import { productsQueryParamsSchema } from 'node_modules/@repo/contracts/src/schemas/product/ProductPageQuery';
const useQueryParams = () => {
  const [searchParams] = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());
  const parsedQueryParams = useMemo(() => productsQueryParamsSchema.parse(params), [searchParams]);

  return {
    queryParams: parsedQueryParams,
  };
};

export default useQueryParams;
