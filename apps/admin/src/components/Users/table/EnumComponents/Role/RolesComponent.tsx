import { Badge } from '@/components/ui/badge';
import type { TableRowType } from '../../../Users';
import { STATUS_VARIANTS } from './roles-variants';
import StatusTextMapping from '@/EnumTextMapping/StatusTextMapping';

export type RoleType = TableRowType['role'];

const RolesComponent = ({ value }: { value: RoleType }) => {
  const variant = STATUS_VARIANTS[value];

  if (!variant) {
    return null; // or a fallback badge
  }

  const Icon = variant.Icon;
  const textMapping = StatusTextMapping[value];
  return (
    <Badge variant="outline" className={`rounded-sm cursor-default ${variant.className}`}>
      <Icon className="mr-1 h-4 w-4" />
      {textMapping}
    </Badge>
  );
};

export default RolesComponent;
