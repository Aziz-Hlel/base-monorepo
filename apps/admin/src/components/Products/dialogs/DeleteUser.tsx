import { useSelectedRow } from '../context/selected-row-provider';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import userService from '@/Api/service/userService';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

const DeleteUser = () => {
  const { handleCancel, openDialog, currentRow } = useSelectedRow();
  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation({
    mutationKey: ['users', 'delete'],
    mutationFn: userService.deleteUserProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'], exact: false });
      toast.success('User deleted successfully');
      handleCancel();
    },
  });

  const deleteUser = async () => {
    try {
      await mutateAsync(currentRow?.id!);
    } catch (error) {
      toast.error('Failed to delete user');
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
              This action cannot be undone. This will permanently delete the user {currentRow?.username} and remove
              their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
            <Button onClick={deleteUser} className=" bg-red-600 hover:bg-red-500">
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DeleteUser;
