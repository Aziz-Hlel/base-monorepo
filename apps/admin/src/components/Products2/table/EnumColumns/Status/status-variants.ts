import { CheckCircleIcon, AlertCircleIcon, BanIcon } from 'lucide-react';
import type { StatusType } from './StatusComponent';

export type StatusVariant = {
  className: string;
  Icon: React.ComponentType<{ className?: string }>;
};

export const STATUS_VARIANTS: Record<StatusType, StatusVariant> = {
  ACTIVE: {
    Icon: CheckCircleIcon,
    className: 'border-green-600 text-green-600 bg-green-300/5 hover:bg-green-600/10',
  },
  EXPIRED: {
    Icon: AlertCircleIcon,
    className: 'border-yellow-600 text-yellow-600 bg-yellow-300/5 hover:bg-yellow-600/10',
  },
  DELETED: {
    Icon: BanIcon,
    className: 'border-destructive text-destructive bg-red-300/5 hover:bg-destructive/10',
  },
  INACTIVE: {
    Icon: AlertCircleIcon,
    className: 'border-gray-600 text-gray-600 bg-gray-300/5 hover:bg-gray-600/10',
  },
};
