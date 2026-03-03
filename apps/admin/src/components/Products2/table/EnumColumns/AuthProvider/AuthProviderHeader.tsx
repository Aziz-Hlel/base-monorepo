import type { Column } from '@tanstack/react-table';
import HeaderContainer from '../../ContainerComp/HeaderContainer';
import type { TableRowType } from '../../tableDeclarations/typesAndFieldsDeclaration';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const AuthProviderHeader = ({ column }: { column: Column<TableRowType> }) => {
  return (
    <HeaderContainer onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className=" underline hover:cursor-help">A.P</span>
        </TooltipTrigger>
        <TooltipContent>
          <p>Auth Provider</p>
        </TooltipContent>
      </Tooltip>

      {/* {column.getIsSorted() === 'asc' && <ArrowUp />}
      {column.getIsSorted() === 'desc' && <ArrowUp className="rotate-180" />}
      {column.getIsSorted() === false && <ChevronsUpDown />} */}
    </HeaderContainer>
  );
};

export default AuthProviderHeader;
