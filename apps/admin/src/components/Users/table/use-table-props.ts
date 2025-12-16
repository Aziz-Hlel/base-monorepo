import type {
  ColumnFiltersState,
  PaginationState,
  SortingState,
  Updater,
  VisibilityState,
} from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { allowedFilterIds, columnFiltersKeys, searchKey } from '../Users';

const useTableProps = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection] = useState({});

  const onSortingChange = (updater: Updater<SortingState>) => {
    const newSortingState = typeof updater === 'function' ? updater(sorting) : updater;

    const sortField = newSortingState[0]?.id ?? 'createdAt';
    const sortOrder = newSortingState[0]?.desc ? 'desc' : 'asc';

    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set('sort', sortField);
      params.set('order', sortOrder);
      return params;
    });
  };

  const sorting = useMemo(() => {
    if (searchParams.get('sort') && searchParams.get('order')) {
      return [
        {
          id: searchParams.get('sort') as string,
          desc: searchParams.get('order') === 'desc',
        },
      ];
    }
    return [];
  }, [searchParams.toString()]);

  const columnFilters = useMemo(() => {
    const columnFilters = [];
    for (const columnFilter of allowedFilterIds) {
      const filterValue = searchParams.get(columnFilter);
      if (filterValue !== null && filterValue !== '') {
        if (columnFilter === searchKey) {
          columnFilters.push({
            id: columnFilter,
            value: filterValue,
          });
        }

        if (columnFiltersKeys.includes(columnFilter as any)) {
          columnFilters.push({
            id: columnFilter,
            value: filterValue.split(',') || [],
          });
        }
      }
    }

    console.log('derived colum filter : ', columnFilters);
    return columnFilters;
  }, [searchParams.toString()]);

  const onColumnFiltersChange = (updater: Updater<ColumnFiltersState>) => {
    const newColumnFiltersState = typeof updater === 'function' ? updater(columnFilters) : updater;
    console.log('newColumnFiltersState : ', newColumnFiltersState);
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      if (newColumnFiltersState.length === 0) {
        // clear all filters
        for (const key of allowedFilterIds) {
          params.delete(key);
        }
        params.set('page', '1');
        return params;
      }
      for (const { id, value } of newColumnFiltersState) {
        if (!allowedFilterIds.has(id)) continue;

        if (value == null || (Array.isArray(value) && value.length === 0) || value === '') {
          params.delete(id);
          continue;
        }

        if (Array.isArray(value)) {
          params.set(id, value.toString());
          continue;
        }

        if (typeof value === 'string') {
          params.set(id, value);
        }
      }

      params.set('page', '1');
      return params;
    });
  };

  const pageSize = useMemo(() => {
    const size = Number(searchParams.get('size'));

    if (size < 5) {
      searchParams.set('size', '5');
      return 5;
    }
    return size;
  }, [searchParams.toString()]);

  const pageNumber = useMemo(() => {
    const pageNumber = Number(searchParams.get('page'));
    if (pageNumber < 1) {
      searchParams.set('page', '1');
      return 1;
    }
    return pageNumber;
  }, [searchParams.toString()]);

  const pagination = useMemo<PaginationState>(() => {
    let pageSize = Number(searchParams.get('size'));
    let pageIndex = Number(searchParams.get('page'));

    if (pageSize < 5 || isNaN(pageSize)) {
      pageSize = 5;
    }
    if (pageIndex < 1 || isNaN(pageIndex)) {
      pageIndex = 1;
    }
    searchParams.set('size', pageSize.toString());
    searchParams.set('page', pageIndex.toString());
    return {
      pageSize,
      pageIndex: pageIndex - 1,
    };
  }, [pageSize, pageNumber]);

  const onPaginationChange = (updater: Updater<PaginationState>) => {
    const newPaginationState = typeof updater === 'function' ? updater({ pageSize, pageIndex: pageNumber }) : updater;
    console.log('l page index jet :', newPaginationState.pageIndex);
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set('size', String(newPaginationState.pageSize));
      params.set('page', String(newPaginationState.pageIndex + 1)); // react-table uses zero-based index
      return params;
    });
  };

  return {
    sorting,
    onSortingChange,
    columnFilters,
    onColumnFiltersChange,
    pageSize,
    pagination,
    onPaginationChange,
    columnVisibility,
    setColumnVisibility,
    rowSelection,
  };
};

export default useTableProps;
