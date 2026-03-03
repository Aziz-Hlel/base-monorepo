import { useSelectedRow } from '../context/selected-row-provider';
import AddOffer from './AddOffer';
import DeleteProduct from './DeleteOffer';
import EditProduct from './EditOffer';
import FeatureOffer from './FeatureOffer';

const DialogContainer = () => {
  const { openDialog } = useSelectedRow();
  if (openDialog === 'add') return <AddOffer />;
  if (openDialog === 'delete') return <DeleteProduct />;
  if (openDialog === 'edit') return <EditProduct />;
  if (openDialog === 'feature') return <FeatureOffer />;
};

export default DialogContainer;
