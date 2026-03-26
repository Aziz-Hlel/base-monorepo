import eventService from '@/Api/service/eventService';
import { Button } from '@/components/ui/button';
import { DialogClose, DialogFooter } from '@/components/ui/dialog';
import { FieldGroup } from '@/components/ui/field';
import { Spinner } from '@/components/ui/spinner';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateEventSchema, type UpdateEventSchema } from '@repo/contracts/schemas/events/updateEventSchema';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';
import { useSelectedRow } from '../../context/selected-row-provider';
import { MODULE_NAME } from '../../core/core';
import FormUI from '../shared/FormUI';
import type { TableRowType } from '../../core/types';

const UpdateDialogInner = ({ selectedRow }: { selectedRow: TableRowType }) => {
  const { handleCancel } = useSelectedRow();

  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationKey: [MODULE_NAME, 'update'],
    mutationFn: eventService.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MODULE_NAME], exact: false });
      handleCancel();
    },
  });

  const defaultValues: UpdateEventSchema = {
    description: selectedRow.description,
    thumbnailId: selectedRow.thumbnail?.id ?? '',
  };

  const form = useForm<UpdateEventSchema>({
    resolver: zodResolver(updateEventSchema),
    defaultValues: defaultValues,
  });

  const onSubmit: SubmitHandler<UpdateEventSchema> = async (data) => {
    try {
      await mutateAsync({ id: selectedRow.id, data });
      toast.success('Product updated successfully');
    } catch (error) {
      toast.error('Failed to update product');
    }
  };

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
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex flex-col h-full">
      <div className="flex-1 min-h-0 overflow-y-auto pr-2 overscroll-contain scrollbar-thin scrollbar-thumb-neutral-300 scrollbar-track-transparent hover:scrollbar-thumb-neutral-400">
        <FieldGroup>
          <FormUI
            form={form}
            initMedia={selectedRow.thumbnail}
            thumbnailErrors={thumbnailErrors}
            clearMediaErrors={clearMediaErrors}
            handleThumbnailUpload={handleThumbnailUpload}
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
  );
};

export default UpdateDialogInner;
