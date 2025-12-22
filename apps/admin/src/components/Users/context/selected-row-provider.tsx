import { createContext, useContext, useState } from 'react';
import type { TableRowType } from '../table/tableDeclarations/typesAndFieldsDeclaration';

type TableDialogType = 'add' | 'edit' | 'delete' | null;

type SelectedRowContextType = {
  openDialog: TableDialogType;
  setOpenDialog: (str: TableDialogType) => void;
  currentRow: TableRowType | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<TableRowType | null>>;
  handleCancel: () => void;
};

const SelectedRowContext = createContext<SelectedRowContextType | null>(null);

export function SelectedRowProvider({ children }: { children: React.ReactNode }) {
  const [openDialog, setOpenDialog] = useState<TableDialogType>(null);
  const [currentRow, setCurrentRow] = useState<TableRowType | null>(null);

  const handleCancel = () => {
    setCurrentRow(null);
    setOpenDialog(null);
  };

  return (
    <SelectedRowContext.Provider value={{ openDialog, setOpenDialog, currentRow, setCurrentRow, handleCancel }}>
      {children}
    </SelectedRowContext.Provider>
  );
}

export const useSelectedRow = () => {
  const context = useContext(SelectedRowContext);
  if (!context) {
    throw new Error('useSelectedRow must be used within a SelectedRowProvider');
  }
  return context;
};
