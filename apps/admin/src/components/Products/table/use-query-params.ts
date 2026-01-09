import z from 'zod';
import { sortableColumnKeys } from './tableDeclarations/typesAndFieldsDeclaration';
import { useSearchParams } from 'react-router-dom';
import { useMemo } from 'react';
import { ProductStatus } from '@contracts/types/enums/enums';

const csvEnumArray = <T extends string[]>(values: T) =>
  z
    .string()
    .transform((value) =>
      value
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean),
    )
    .pipe(z.array(z.enum(values)));

const queryParamsSchema = z.object({
  page: z.coerce.number().int().positive().catch(1),
  size: z.coerce.number().int().min(5).max(50).catch(10),
  sort: z.enum(sortableColumnKeys).catch('createdAt'),
  order: z.enum(['asc', 'desc']).catch('desc'),
  search: z.string().catch(''),
  // Filters
  status: csvEnumArray(Object.values(ProductStatus)).catch([]),
});
export type TableQueryParams = z.infer<typeof queryParamsSchema>;
export type RequiredTableQueryParams = TableQueryParams;

export const defaultQuery: RequiredTableQueryParams = {
  page: 1,
  size: 10,
  sort: 'createdAt',
  order: 'desc',
  search: '',
  status: [],
};

const useQueryParams = () => {
  const [searchParams] = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());
  const parsedQueryParams = useMemo(() => queryParamsSchema.parse(params), [searchParams]);

  return {
    queryParams: parsedQueryParams,
  };
};

export default useQueryParams;
