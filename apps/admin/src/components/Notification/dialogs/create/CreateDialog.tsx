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
import FormUI from '../shared/FormUI';
import notificationService from '@/Api/service/notificationService';
import {
  createNotificationSchema,
  type CreateNotificationRequest,
} from '@repo/contracts/schemas/notification/createNotification';

const CreateDialog = () => {
  const { handleCancel, dialogState } = useSelectedRow();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationKey: [TableData.MODULE_NAME, 'create'],
    mutationFn: notificationService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TableData.MODULE_NAME], exact: false });
      form.reset();
      handleCancel();
    },
  });

  const defaultValues: CreateNotificationRequest = {
    description: '',
    recipients: {
      type: 'ALL',
    },
    payload: {
      en: {
        language: 'en',
        title: '',
        content: '',
        data: '',
      },
    },
    schedule: {
      scheduleType: 'DELAYED',
      delaySeconds: 0,
    },
  };

  const form = useForm<CreateNotificationRequest>({
    resolver: zodResolver(createNotificationSchema),
    defaultValues: defaultValues,
  });

  const onOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
      handleCancel();
    }
  };

  const onSubmit: SubmitHandler<CreateNotificationRequest> = async (data) => {
    try {
      await mutateAsync(data);
      toast.success(`${TableData.ModuleName} created successfully`);
    } catch (error) {
      toast.error(`Failed to create ${TableData.ModuleName}`);
    }
  };

  const dialogIsOpen = dialogState.openDialog === 'add';

  return (
    <Dialog onOpenChange={onOpenChange} open={dialogIsOpen}>
      <DialogContent className='flex h-[calc(100dvh-4rem)] flex-col overflow-hidden sm:max-w-106.25'>
        <form onSubmit={form.handleSubmit(onSubmit)} className='flex h-full flex-col space-y-6'>
          <DialogHeader>
            <DialogTitle className='bg-__tw_debug'>{TableData.AddDialog.title}</DialogTitle>
            <DialogDescription>{TableData.AddDialog.description}</DialogDescription>
          </DialogHeader>
          <div className='scrollbar-thin scrollbar-thumb-neutral-300 scrollbar-track-transparent hover:scrollbar-thumb-neutral-400 min-h-0 flex-1 overflow-y-auto overscroll-contain pr-2'>
            <FieldGroup>
              <FormUI form={form} initMedia={null} />
            </FieldGroup>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant='outline' onClick={handleCancel}>
                {TableData.AddDialog.buttons.cancel}
              </Button>
            </DialogClose>
            <Button type='submit' className='w-28' disabled={isPending}>
              {isPending ? <Spinner /> : <span>{TableData.AddDialog.buttons.submit}</span>}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDialog;
