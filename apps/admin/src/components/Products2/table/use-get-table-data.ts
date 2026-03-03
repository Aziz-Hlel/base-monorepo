import { useQuery } from '@tanstack/react-query';
import type { TableRowType } from './tableDeclarations/typesAndFieldsDeclaration';
import useQueryParams from './use-query-params';
import type { Pageable } from '@contracts/types/page/Pageable';
import offerService from '@/Api/service/offerService';

const blankPagination: Pageable = {
  size: 0,
  number: 0,
  totalElements: 0,
  totalPages: 0,
  offset: 0,
  pageSize: 0,
};

const useGetTableData = () => {
  const { queryParams } = useQueryParams();
  const adjustedQueryParams = {
    ...queryParams,
    page: queryParams.page,
    status: queryParams.status.join(','),
  };

  const { data, isFetching } = useQuery({
    queryKey: ['offers', { ...queryParams }],
    queryFn: async () => await offerService.getPage(adjustedQueryParams),
    placeholderData: (previousData) => previousData,
  });

  const tableData: TableRowType[] = data?.content ?? [];
  const pagination = data?.pagination ?? blankPagination;

  return { tableData, pagination, isLoading: isFetching };
};

export default useGetTableData;
