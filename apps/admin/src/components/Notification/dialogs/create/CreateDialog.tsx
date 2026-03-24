import { useSelectedRow } from '../../context/selected-row-provider';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { Spinner } from '@/components/ui/spinner';
import { FieldGroup } from '@/components/ui/field';
import { toast } from 'sonner';
import { TableData } from '../../core/core';
import { createEventSchema, type CreateEventSchema } from '@repo/contracts/schemas/events/createEventSchema';
import eventService from '@/Api/service/eventService';
import FormUI from '../shared/FormUI';

const CreateDialog = () => {
  const { handleCancel, dialogState } = useSelectedRow();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationKey: [TableData.MODULE_NAME, 'create'],
    mutationFn: eventService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TableData.MODULE_NAME], exact: false });
      form.reset();
      handleCancel();
    },
  });

  const defaultValues: CreateEventSchema = {
    description: '',
    thumbnailId: '',
  };

  const form = useForm<CreateEventSchema>({
    resolver: zodResolver(createEventSchema),
    defaultValues: defaultValues,
  });

  const onOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
      handleCancel();
    }
  };

  const onSubmit: SubmitHandler<CreateEventSchema> = async (data) => {
    try {
      await mutateAsync(data);
      toast.success(`${TableData.ModuleName} created successfully`);
    } catch (error) {
      toast.error(`Failed to create ${TableData.ModuleName}`);
    }
  };

  const dialogIsOpen = dialogState.openDialog === 'add';

  const thumbnailErrors = [form.formState.errors.thumbnailId?.message];

  const clearMediaErrors = () => {
    form.clearErrors('thumbnailId');
  };

  const handleThumbnailUpload = (newMediaId: string | null) => {
    const options = newMediaId ? { shouldDirty: true, shouldValidate: true } : undefined;
    form.setValue('thumbnailId', newMediaId ?? '', options);
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={dialogIsOpen}>
      <DialogContent className="sm:max-w-106.25 h-[calc(100dvh-4rem)] flex flex-col overflow-hidden  ">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex flex-col h-full">
          <DialogHeader>
            <DialogTitle className="bg-__tw_debug ">{TableData.AddDialog.title}</DialogTitle>
            <DialogDescription>{TableData.AddDialog.description}</DialogDescription>
          </DialogHeader>
          <div
            className=" 
              flex-1 min-h-0 overflow-y-auto pr-2  overscroll-contain scrollbar-thin scrollbar-thumb-neutral-300 scrollbar-track-transparent hover:scrollbar-thumb-neutral-400"
          >
            <FieldGroup>
              <FormUI
                form={form}
                initMedia={null}
                thumbnailErrors={thumbnailErrors}
                clearMediaErrors={clearMediaErrors}
                handleThumbnailUpload={handleThumbnailUpload}
              />
            </FieldGroup>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" onClick={handleCancel}>
                {TableData.AddDialog.buttons.cancel}
              </Button>
            </DialogClose>
            <Button type="submit" className=" w-28" disabled={isPending}>
              {isPending ? <Spinner /> : <span>{TableData.AddDialog.buttons.submit}</span>}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDialog;
