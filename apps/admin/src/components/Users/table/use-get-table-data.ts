import userService from '@/Api/service/userService';
import type { Pageable } from '@/types22/page/Pageable';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import type { TableRowType } from '../Users';

const blankPagination: Pageable = {
  size: 0,
  number: 0,
  totalElements: 0,
  totalPages: 0,
  offset: 0,
  pageSize: 0,
};

const useGetTableData = () => {
  const [searchParams] = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());

  const queryParams = {
    ...params,
    page: params.page ? Number(params.page) - 1 : 0,
  };

  const { data, isLoading } = useQuery({
    queryKey: ['users', searchParams.toString()],
    queryFn: async () => await userService.getUsers(queryParams),
  });

  const tableData: TableRowType[] = data?.content ?? [];
  const pagination = data?.pagination ?? blankPagination;

  return { tableData, pagination, isLoading };
};

export default useGetTableData;
