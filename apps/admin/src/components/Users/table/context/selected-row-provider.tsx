import { createContext, useContext, useState } from 'react';
import type { TableRowType } from '../tableDeclarations/typeNfieldsDeclaration';

type TableDialogType = 'add' | 'edit' | 'delete' | null;

type SelectedRowContextType = {
  openDialog: TableDialogType;
  setOpenDialog: (str: TableDialogType) => void;
  currentRow: TableRowType | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<TableRowType | null>>;
};

const SelectedRowContext = createContext<SelectedRowContextType | null>(null);

export function SelectedRowProvider({ children }: { children: React.ReactNode }) {
  const [openDialog, setOpenDialog] = useState<TableDialogType>(null);
  const [currentRow, setCurrentRow] = useState<TableRowType | null>(null);

  return (
    <SelectedRowContext value={{ openDialog, setOpenDialog, currentRow, setCurrentRow }}>{children}</SelectedRowContext>
  );
}

export const useSelectedRow = () => {
  const context = useContext(SelectedRowContext);
  if (!context) {
    throw new Error('useSelectedRow must be used within a SelectedRowProvider');
  }
  return context;
};
