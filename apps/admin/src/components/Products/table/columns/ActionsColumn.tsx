import { CircleMinus, EllipsisVertical, Trash2, UserPen } from 'lucide-react';

import React, { Fragment } from 'react';
import type { TableRowType } from '../tableDeclarations/typesAndFieldsDeclaration';
import type { Row } from '@tanstack/react-table';
import PERMISSION_SCORE from '@contracts/utils/PermissionScore';
import { useUser } from '@/context/UserContext';
import { useSelectedRow } from '../../context/selected-row-provider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import RowContainer from '../ContainerComp/RowContainer';
import { Button } from '@/components/ui/button';

type RowAction = {
  key: 'edit' | 'delete' | 'disable' | 'enable';
  label: string;
  icon: React.ReactNode;
  isVisible: boolean;
  isPermitted: boolean;
  isDisabled: boolean;
  onClick: () => void;
  tooltipMessage?: string;
};

type RowActionState = {
  isPermitted: boolean; // based on role
  isDisabled: boolean; // based on status like DELETED / DISABLED
  tooltipMessage?: string; // reason for disable
};

const ActionsColumn = ({ row }: { row: Row<TableRowType> }) => {
  const userRole = useUser().userRole;
  const { handleDialogChange, setCurrentRow } = useSelectedRow();

  const canActOnUser = PERMISSION_SCORE[userRole] >= PERMISSION_SCORE[row.original.role];

  const isDeleted = row.original.status === 'DELETED';
  const isDisabled = row.original.status === 'DISABLED';

  const getActionState = (actionKey: RowAction['key']): RowActionState => {
    if (isDeleted) {
      return {
        isPermitted: false,
        isDisabled: true,
        tooltipMessage: `You cannot ${actionKey} a deleted user.`,
      };
    }

    const isPermitted = canActOnUser;
    return {
      isPermitted,
      isDisabled: false,
      tooltipMessage: isPermitted ? undefined : `You do not have permission to ${actionKey} this user.`,
    };
  };

  const actions: RowAction[] = [
    {
      key: 'edit',
      label: 'Edit',
      icon: <UserPen size={16} className="text-green-500" />,
      isVisible: true,

      onClick: () => {
        setCurrentRow(row.original);
        handleDialogChange('edit');
      },
    },
    {
      key: 'disable',
      label: 'Disable',
      icon: <CircleMinus size={16} className="text-amber-500" />,
      isVisible: !isDisabled,
      onClick: () => {
        setCurrentRow(row.original);
        handleDialogChange('disable');
      },
    },
    {
      key: 'enable',
      label: 'Enable',
      icon: <CircleMinus size={16} className="text-blue-500" />,
      isVisible: isDisabled,
      onClick: () => {
        setCurrentRow(row.original);
        handleDialogChange('enable');
      },
    },
    {
      key: 'delete',
      label: 'Delete',
      icon: <Trash2 size={16} className="text-red-500" />,
      isVisible: true,
      onClick: () => {
        setCurrentRow(row.original);
        handleDialogChange('delete');
      },
    },
  ].map((action) => ({
    ...action,
    ...getActionState(action.key as RowAction['key']),
    key: action.key as RowAction['key'],
  }));

  return (
    <>
      <RowContainer className="justify-end ps-0">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild className=" flex justify-center">
            <Button variant="ghost" className="flex  p-0 data-[state=open]:bg-muted has-[>svg]:px-0  h-fit">
              <EllipsisVertical className=" size-4 rotate-90 rounded-full hover:bg-gray-200  cursor-pointer" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            {actions
              .filter((action) => action.isVisible)
              .map((action) => (
                <Fragment key={action.key}>
                  <DropdownMenuItem
                    onClick={action.isPermitted ? action.onClick : undefined}
                    className={!action.isPermitted ? 'cursor-not-allowed' : ''}
                  >
                    {action.isPermitted && !action.isDisabled ? (
                      <span>{action.label}</span>
                    ) : (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="opacity-50">{action.label}</span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{action.tooltipMessage}</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                    <DropdownMenuShortcut>{action.icon}</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </Fragment>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </RowContainer>
    </>
  );
};

export default ActionsColumn;
