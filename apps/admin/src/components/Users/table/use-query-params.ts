import { useSearchParams } from 'react-router-dom';
import { useMemo } from 'react';
import { queryParamsSchema } from '@contracts/schemas/user/UserPageQuery';

const useQueryParams = () => {
  const [searchParams] = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());
  const parsedQueryParams = useMemo(() => queryParamsSchema.parse(params), [searchParams]);

  return {
    queryParams: parsedQueryParams,
  };
};

export default useQueryParams;
