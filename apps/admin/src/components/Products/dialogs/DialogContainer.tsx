import { useSelectedRow } from '../context/selected-row-provider';
import AddProduct from './AddProduct';
import DeleteProduct from './DeleteProduct';
import EditProduct from './EditProduct';

const DialogContainer = () => {
  const { openDialog } = useSelectedRow();
  if (openDialog === 'add') return <AddProduct />;
  if (openDialog === 'delete') return <DeleteProduct />;
  if (openDialog === 'edit') return <EditProduct />;
};

export default DialogContainer;
