import { CheckCircleIcon, BanIcon } from 'lucide-react';
import type { RoleType } from './RolesComponent';

export type StatusVariant = {
  className: string;
  Icon: React.ComponentType<{ className?: string }>;
};

export const STATUS_VARIANTS: Record<RoleType, StatusVariant> = {
  ADMIN: {
    Icon: CheckCircleIcon,
    className: 'border-green-600 text-green-600 bg-green-300/5 hover:bg-green-600/10',
  },
  USER: {
    Icon: BanIcon,
    className: 'border-destructive text-destructive bg-red/5 hover:bg-destructive/10',
  },
};
