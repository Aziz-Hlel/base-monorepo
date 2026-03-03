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

const FeatureOffer = () => {
  const { handleCancel, openDialog, currentRow } = useSelectedRow();
  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation({
    mutationKey: ['offers', 'feature'],
    mutationFn: offerService.toggleFeatured,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers'], exact: false });
      toast.success('Offer featured successfully');
      handleCancel();
    },
  });

  const featureOffer = async () => {
    try {
      await mutateAsync(currentRow?.id!);
    } catch (error) {
      toast.error('Failed to feature offer');
      handleCancel();
    }
  };
  const dialogOpen = openDialog === 'feature';

  const IsofferFeatured = currentRow?.isFeatured;

  const title = IsofferFeatured ? 'unfeature' : 'feature';
  const descriptionAction = IsofferFeatured
    ? 'This action will unfeature the offer'
    : 'This action will feature the offer';
  const action = IsofferFeatured ? 'unfeaturing' : 'featuring';
  return (
    <>
      <AlertDialog open={dialogOpen} onOpenChange={handleCancel}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className=" capitalize"> {title}</AlertDialogTitle>
            <AlertDialogDescription>{descriptionAction}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
            <Button onClick={featureOffer} className=" bg-blue-600 hover:bg-blue-500 capitalize">
              {action}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default FeatureOffer;
