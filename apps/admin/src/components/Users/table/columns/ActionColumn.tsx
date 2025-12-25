import React from 'react';
import RowContainer from '../ContainerComp/RowContainer';
import type { TableRowType } from '../tableDeclarations/typesAndFieldsDeclaration';
import type { Row } from '@tanstack/react-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { EllipsisVertical, UserPen, Trash2, CircleMinus } from 'lucide-react';
import { useSelectedRow } from '../../context/selected-row-provider';
import { useUser } from '@/context/UserContext';
import PERMISSION_SCORE from '@contracts/utils/PermissionScore';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const ActionColumn = ({ row }: { row: Row<TableRowType> }) => {
  const { handleDialogChange, setCurrentRow, openDialog } = useSelectedRow();

  const userRole = useUser().userRole;

  const isPermitted = PERMISSION_SCORE[userRole] >= PERMISSION_SCORE[row.original.role];

  const handleEdit = () => {
    if (isPermitted) {
      setCurrentRow(row.original);
      handleDialogChange('edit');
    }
  };

  const handleDelete = () => {
    if (isPermitted) {
      setCurrentRow(row.original);
      handleDialogChange('delete');
    }
  };

  const handleDisable = () => {
    if (isPermitted) {
      setCurrentRow(row.original);
      handleDialogChange('disable');
    }
  };

  return (
    <RowContainer className="justify-end ps-0">
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild className=" flex justify-center">
          <Button variant="ghost" className="flex  p-0 data-[state=open]:bg-muted has-[>svg]:px-0  h-fit">
            <EllipsisVertical className=" size-4 rotate-90 rounded-full hover:bg-gray-200  cursor-pointer" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onClick={handleEdit}>
            {isPermitted ? (
              <>
                <span>Edit</span>
              </>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="opacity-50 cursor-not-allowed">Edit</span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>You do not have permission to edit this user.</p>
                </TooltipContent>
              </Tooltip>
            )}

            <DropdownMenuShortcut>
              <UserPen size={16} className="text-green-500" />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleDisable} className=" cursor-pointer">
            {isPermitted ? (
              <>
                <span>Disable</span>
              </>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="opacity-50 cursor-not-allowed">Disable</span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>You do not have permission to disable this user.</p>
                </TooltipContent>
              </Tooltip>
            )}
            <DropdownMenuShortcut>
              <CircleMinus size={16} className=" text-amber-500" />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleDelete} className=" cursor-pointer">
            {isPermitted ? (
              <>
                <span>Delete</span>
              </>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="opacity-50 cursor-not-allowed">Delete</span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>You do not have permission to delete this user.</p>
                </TooltipContent>
              </Tooltip>
            )}
            <DropdownMenuShortcut>
              <Trash2 size={16} className="text-red-500" />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </RowContainer>
  );
};

export default ActionColumn;
