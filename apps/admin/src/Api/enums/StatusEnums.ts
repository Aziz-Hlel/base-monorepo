const StatusEnums = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  PENDING: 'Pending',
  DELETED: 'Deleted',
} as const;
export default StatusEnums;
export type StatusEnum = keyof typeof StatusEnums;
