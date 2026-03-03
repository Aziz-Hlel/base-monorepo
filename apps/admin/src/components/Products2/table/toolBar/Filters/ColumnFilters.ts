import offerStatusTextMapping from '@/EnumTextMapping/offerStatusTextMapping';
import type { TableRowType } from '../../tableDeclarations/typesAndFieldsDeclaration';

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
  options: Object.keys(offerStatusTextMapping).map((key) => ({
    label: offerStatusTextMapping[key as keyof typeof offerStatusTextMapping],
    value: key as keyof typeof offerStatusTextMapping,
  })),
};

const tableFilters = [statusFilterData];

export default tableFilters;
