import { useSearchParams } from 'react-router-dom';
import { useMemo } from 'react';
import { offersQueryParamsSchema } from '@contracts/schemas/offre/OfferPageQuery';

const useQueryParams = () => {
  const [searchParams] = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());
  const parsedQueryParams = useMemo(() => offersQueryParamsSchema.parse(params), [searchParams]);

  return {
    queryParams: parsedQueryParams,
  };
};

export default useQueryParams;
