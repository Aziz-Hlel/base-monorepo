import type { StatusEnum } from '@/Api/enums/StatusEnums';

const StatusTextMapping: Record<StatusEnum, string> = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  PENDING: 'Pending',
  DELETED: 'Deleted',
};

export default StatusTextMapping;