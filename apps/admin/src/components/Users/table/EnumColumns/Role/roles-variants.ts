import { UserRound, CircleUser, ShieldUser, UserStar } from 'lucide-react';
import type { RoleType } from './RolesComponent';

export type StatusVariant = {
  className: string;
  Icon: React.ComponentType<{ className?: string }>;
};

export const STATUS_VARIANTS: Record<RoleType, StatusVariant> = {
  ADMIN: {
    Icon: UserStar,
    className: 'border-green-600 text-green-600 bg-green-300/5 hover:bg-green-600/10',
  },
  USER: {
    Icon: UserRound,
    className: 'border-destructive text-destructive bg-red/5 hover:bg-destructive/10',
  },
  STAFF: {
    Icon: CircleUser,
    className: 'border-blue-600 text-blue-600 bg-blue-300/5 hover:bg-blue-600/10',
  },
  SUPER_ADMIN: {
    Icon: ShieldUser,
    className: 'border-purple-600 text-purple-600 bg-purple-300/5 hover:bg-purple-600/10',
  },
};
