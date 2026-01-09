import { Badge } from '@/components/ui/badge';
import { STATUS_VARIANTS } from './status-variants';
import type { TableRowType } from '../../tableDeclarations/typesAndFieldsDeclaration';
import ProductTextMapping from '@/EnumTextMapping/ProductTextMapping';

export type StatusType = TableRowType['status'];

const StatusComponent = ({ value }: { value: StatusType }) => {
  const variant = STATUS_VARIANTS[value];

  if (!variant) {
    return null; // or a fallback badge
  }

  const Icon = variant.Icon;
  const textMapping = ProductTextMapping[value];
  return (
    <Badge variant="outline" className={`rounded-sm cursor-default ${variant.className}`}>
      <Icon className="mr-1 h-4 w-4" />
      {textMapping}
    </Badge>
  );
};

export default StatusComponent;
