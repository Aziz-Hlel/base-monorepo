import type { StatusType } from '@/components/Users/table/EnumColumns/Status/StatusComponent';

const StatusTextMapping: Record<StatusType, string> = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  DISABLED: 'Disabled',
  DELETED: 'Deleted',
};

export default StatusTextMapping;
