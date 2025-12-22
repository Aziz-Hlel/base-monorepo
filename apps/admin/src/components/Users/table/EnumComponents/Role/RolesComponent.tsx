import type { TableRowType } from '../../tableDeclarations/typesAndFieldsDeclaration';
import { STATUS_VARIANTS } from './roles-variants';
import RolesTextMapping from '@/EnumTextMapping/RolesTextMapping';

export type RoleType = TableRowType['role'];

const RolesComponent = ({ value }: { value: RoleType }) => {
  const variant = STATUS_VARIANTS[value];

  if (!variant) {
    return null; // or a fallback badge
  }

  const Icon = variant.Icon;
  const textMapping = RolesTextMapping[value];
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4" />
      <span>{textMapping}</span>
    </div>
  );
};

export default RolesComponent;
