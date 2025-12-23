import { useSelectedRow } from '../context/selected-row-provider';
import AddUser from './AddUser';

const DialogContainer = () => {
  const { openDialog } = useSelectedRow();
  if (openDialog === 'add') {
    return <AddUser />;
  }
  return null;
};

export default DialogContainer;
