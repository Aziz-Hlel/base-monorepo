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
import { useSelectedRow } from '../context/selected-row-provider';
import userService from '@/Api/service/userService';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';

const DisableUser = () => {
  const { handleCancel, openDialog, currentRow } = useSelectedRow();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['users', 'disable'],
    mutationFn: userService.disableUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'], exact: false });
      toast.success('User disabled successfully');
      handleCancel();
    },
  });

  const disableUser = async () => {
    try {
      await mutateAsync(currentRow?.id!);
    } catch (error) {
      toast.error('Failed to disable user');
      handleCancel();
    }
  };
  const dialogOpen = openDialog === 'disable';
  return (
    <>
      <AlertDialog open={dialogOpen} onOpenChange={handleCancel}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user {currentRow?.username} and remove
              their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
            <Button onClick={disableUser} className="bg-red-600 hover:bg-red-500 w-20" disabled={isPending}>
              {!isPending ? <span>Disable</span> : <Spinner />}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DisableUser;
