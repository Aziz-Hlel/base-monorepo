import { CheckCircleIcon, AlertCircleIcon, BanIcon } from 'lucide-react';
import type { ProductStatus } from '@repo/contracts/types/enums/enums';

export type StatusVariant = {
  className: string;
  Icon: React.ComponentType<{ className?: string }>;
};

export const STATUS_VARIANTS: Record<ProductStatus, StatusVariant> = {
  AVAILABLE: {
    Icon: CheckCircleIcon,
    className: 'border-green-600 text-green-600 bg-green-300/5 hover:bg-green-600/10',
  },
  OUT_OF_STOCK: {
    Icon: AlertCircleIcon,
    className: 'border-yellow-600 text-yellow-600 bg-yellow-300/5 hover:bg-yellow-600/10',
  },
  DISCONTINUED: {
    Icon: BanIcon,
    className: 'border-destructive text-destructive bg-red-300/5 hover:bg-destructive/10',
  },
};
