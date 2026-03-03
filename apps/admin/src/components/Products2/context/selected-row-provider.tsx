import { createContext, useContext, useState } from 'react';
import type { TableRowType } from '../table/tableDeclarations/typesAndFieldsDeclaration';

export type TableDialogType = 'add' | 'edit' | 'delete' | 'feature' | null;

type SelectedRowContextType = {
  openDialog: TableDialogType;
  handleDialogChange: (dialogType: TableDialogType, row?: TableRowType) => void;
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

  const handleDialogChange = (dialogType: TableDialogType, row?: TableRowType) => {
    setOpenDialog(dialogType);
    if (row) {
      setCurrentRow(row);
    }
  };

  return (
    <SelectedRowContext.Provider value={{ openDialog, handleDialogChange, currentRow, setCurrentRow, handleCancel }}>
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
