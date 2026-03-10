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
import offerService from '@/Api/service/offerService';

const DeleteOffer = () => {
  const { handleCancel, openDialog, currentRow } = useSelectedRow();
  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation({
    mutationKey: ['offers', 'delete'],
    mutationFn: offerService.deleteOffer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers'], exact: false });
      toast.success('Offer deleted successfully');
      handleCancel();
    },
  });

  const deleteOffer = async () => {
    try {
      await mutateAsync(currentRow?.id!);
    } catch (error) {
      toast.error('Failed to delete offer');
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
              This action cannot be undone. This will permanently delete the offer "{currentRow?.title}" and remove its
              data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
            <Button onClick={deleteOffer} className=" bg-red-600 hover:bg-red-500">
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DeleteOffer;
