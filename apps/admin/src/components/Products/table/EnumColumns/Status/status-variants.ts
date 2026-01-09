import { CheckCircleIcon, AlertCircleIcon, BanIcon } from 'lucide-react';
import type { ProductStatus } from '@contracts/types/enums/enums';

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
    Icon: BanIcon,
    className: 'border-destructive text-destructive bg-red/5 hover:bg-destructive/10',
  },
  DISCONTINUED: {
    Icon: AlertCircleIcon,
    className: 'border-gray-600 text-gray-600 bg-gray-300/5 hover:bg-gray-600/10',
  },
};
