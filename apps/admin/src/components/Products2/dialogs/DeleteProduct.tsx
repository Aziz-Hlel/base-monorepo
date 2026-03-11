import { useSelectedRow } from '../context/selected-row-provider';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import productService from '@/Api/service/productService';

const DeleteProduct = () => {
  const { handleCancel, openDialog, currentRow } = useSelectedRow();
  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation({
    mutationKey: ['products', 'delete'],
    mutationFn: productService.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'], exact: false });
      toast.success('Product deleted successfully');
      handleCancel();
    },
  });

  const deleteProduct = async () => {
    try {
      await mutateAsync(currentRow?.id!);
    } catch (error) {
      toast.error('Failed to delete product');
      handleCancel();
    }
  };
  const dialogOpen = openDialog === 'delete';
  return (
    <>
      <AlertDialog open={dialogOpen} onOpenChange={handleCancel}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product "{currentRow?.name}" and remove its
              data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
            <Button onClick={deleteProduct} className=" bg-red-600 hover:bg-red-500">
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DeleteProduct;
