import userService from '@/Api/service/userService';
import { useQuery } from '@tanstack/react-query';
import type { Pageable } from '@/types/page/Pageable';
import type { TableRowType } from './tableDeclarations/typeNfieldsDeclaration';
import useQueryParams from './use-query-params';

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
    page: queryParams.page ? Number(queryParams.page) - 1 : 0,
  };

  const { data, isFetching } = useQuery({
    queryKey: ['users', { ...queryParams }],
    queryFn: async () => await userService.getUsers(adjustedQueryParams),
    placeholderData: (previousData) => previousData,
  });

  const tableData: TableRowType[] = data?.content ?? [];
  console.log('tableDate', tableData);
  const pagination = data?.pagination ?? blankPagination;

  return { tableData, pagination, isLoading: isFetching };
};

export default useGetTableData;
