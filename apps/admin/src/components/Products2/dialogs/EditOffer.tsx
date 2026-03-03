import { useSelectedRow } from '../context/selected-row-provider';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import InputNumberForm from '@/components/ui2/InputNumberForm/InputNumberForm';
import ImageUpload from '@/components/ui2/ImageUpload/comp/ImageUpload';
import { updateOfferRequestSchema, type UpdateOfferRequest } from '@contracts/schemas/offre/updateOfferRequest';
import offerService from '@/Api/service/offerService';
import { OfferStatus } from '@contracts/types/enums/enums';
import offerStatusTextMapping from '@/EnumTextMapping/offerStatusTextMapping';
import SelectForm from '@/components/ui2/SelectForm/SelectForm';

const EditOffer = () => {
  const { handleCancel, currentRow, openDialog } = useSelectedRow();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['offers', 'update'],
    mutationFn: offerService.updateOffer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers'], exact: false });
      handleCancel();
    },
  });

  if (!currentRow) return null;

  const defaultValues: UpdateOfferRequest = {
    title: currentRow?.title,
    description: currentRow?.description,
    points: currentRow?.points,
    status: currentRow?.status ?? OfferStatus.ACTIVE,
    thumbnailId: currentRow?.thumbnail?.id ?? '',
  };

  const form = useForm<UpdateOfferRequest>({
    resolver: zodResolver(updateOfferRequestSchema),
    defaultValues: defaultValues,
  });

  const onOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
      handleCancel();
    }
  };

  const onSubmit: SubmitHandler<UpdateOfferRequest> = async (data) => {
    try {
      await mutateAsync({ id: currentRow!.id, payload: data });
      toast.success('Offer updated successfully');
    } catch (error) {
      toast.error('Failed to update offer');
    }
  };

  const dialogIsOpen = openDialog === 'edit';
  console.log(form.formState.errors);

  const thumbnailErrors = [form.formState.errors.thumbnailId?.message];

  const clearMediaErrors = () => {
    form.clearErrors('thumbnailId');
  };

  const handleThumbnailUpload = (newMediaId: string | null) => {
    form.setValue(
      'thumbnailId',
      newMediaId ?? '',
      newMediaId ? { shouldDirty: true, shouldValidate: true } : undefined,
    );
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={dialogIsOpen}>
      <DialogContent className="sm:max-w-106.25 h-[calc(100dvh-4rem)] flex flex-col overflow-hidden  ">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex flex-col h-full">
          <DialogHeader>
            <DialogTitle>Edit Offer</DialogTitle>
            <DialogDescription>Fill the form below to edit the offer.</DialogDescription>
          </DialogHeader>
          <div
            className=" 
              flex-1 min-h-0 overflow-y-auto pr-2  overscroll-contain scrollbar-thin 
              scrollbar-thumb-neutral-300 scrollbar-track-transparent hover:scrollbar-thumb-neutral-400"
          >
            <FieldGroup>
              <Controller
                name="title"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={`title-input`}>Title</FieldLabel>
                    <Input {...field} id={`title-input`} aria-invalid={fieldState.invalid} placeholder="Title" />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="description"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={`description-input`}>Description</FieldLabel>
                    <Textarea
                      {...field}
                      id={`description-input`}
                      aria-invalid={fieldState.invalid}
                      placeholder="Description"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name="points"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="flex">
                    <FieldLabel htmlFor={`points-input`}>Points</FieldLabel>
                    <InputNumberForm field={field} />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="status"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="flex">
                    <FieldLabel htmlFor={`status-input`}>Status</FieldLabel>
                    <SelectForm
                      field={field}
                      options={offerStatusTextMapping}
                      placeholder="Select status"
                      label="Status"
                    />
                  </Field>
                )}
              />

              <ImageUpload
                initMedia={currentRow.thumbnail ?? null}
                mediaErrors={thumbnailErrors}
                clearMediaErrors={clearMediaErrors}
                handleMediaUpload={handleThumbnailUpload}
              />
            </FieldGroup>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" className=" w-28" disabled={isPending}>
              {isPending ? <Spinner /> : <span>Save changes</span>}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditOffer;
