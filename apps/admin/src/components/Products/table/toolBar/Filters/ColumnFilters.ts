import type { TableRowType } from '../../tableDeclarations/typesAndFieldsDeclaration';
import ProductTextMapping from '@/EnumTextMapping/ProductTextMapping';

export type ColumnFilter<T extends keyof TableRowType> = {
  columnId: T;
  title: string;
  options: {
    label: string;
    value: TableRowType[T];
    icon?: React.ComponentType<{ className?: string }>;
  }[];
};

const statusFilterData: ColumnFilter<'status'> = {
  columnId: 'status',
  title: 'Status',
  options: Object.keys(ProductTextMapping).map((key) => ({
    label: ProductTextMapping[key as keyof typeof ProductTextMapping],
    value: key as keyof typeof ProductTextMapping,
  })),
};

const tableFilters = [statusFilterData];

export default tableFilters;
