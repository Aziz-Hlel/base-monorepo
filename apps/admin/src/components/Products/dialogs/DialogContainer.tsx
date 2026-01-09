import { useSelectedRow } from '../context/selected-row-provider';
import AddProduct from './AddProduct';
import DeleteUser from './DeleteUser';
import DisableUser from './DisableUser';
import EditUser from './EditUser';
import EnableUser from './EnableUser';

const DialogContainer = () => {
  const { openDialog } = useSelectedRow();
  if (openDialog === 'add') return <AddProduct />;
  if (openDialog === 'delete') return <DeleteUser />;
  if (openDialog === 'disable') return <DisableUser />;
  if (openDialog === 'edit') return <EditUser />;
  if (openDialog === 'enable') return <EnableUser />;
};

export default DialogContainer;
