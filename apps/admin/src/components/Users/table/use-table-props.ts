import type { ColumnFiltersState, SortingState, Updater, VisibilityState } from '@tanstack/react-table';
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

    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);

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

  const changePage = (direc: 'next' | 'prev' | number) => {
    if (pageNumber === 1 && direc === 'prev') return;
    let newPage: number = pageNumber;
    if (typeof direc === 'number') newPage = direc;
    if (direc === 'next') newPage = pageNumber + 1;
    if (direc === 'prev') newPage = pageNumber - 1;
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set('page', String(newPage));
      return params;
    });
  };

  const onPageSizeChange = (size: string) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set('size', String(size));
      params.set('page', '1');
      return params;
    });
  };

  return {
    sorting,
    onSortingChange,
    columnFilters,
    onColumnFiltersChange,
    pageSize,
    pageIndex: pageNumber,
    changePage,
    onPageSizeChange,
    columnVisibility,
    setColumnVisibility,
    rowSelection,
  };
};

export default useTableProps;
