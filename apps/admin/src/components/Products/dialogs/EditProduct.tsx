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
import { Separator } from '@/components/ui/separator';
import productService from '@/Api/service/productService';
import { updateProductRequestSchema, type UpdateProductRequest } from '@contracts/schemas/product/updateProductRequest';
import { Textarea } from '@/components/ui/textarea';
import InputNumberForm from '@/components/ui2/InputNumberForm/InputNumberForm';
import SelectForm from '@/components/ui2/SelectForm/SelectForm';
import ProductTextMapping from '@/EnumTextMapping/ProductTextMapping';
import ImageUpload from '@/components/ui2/ImageUpload/comp/ImageUpload';

const EditProduct = () => {
  const { handleCancel, currentRow, openDialog } = useSelectedRow();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['products', 'update'],
    mutationFn: productService.updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'], exact: false });
      handleCancel();
    },
  });

  if (!currentRow) return null;

  const defaultValues: UpdateProductRequest = {
    name: currentRow?.name,
    description: currentRow?.description,
    price: currentRow?.price,
    status: currentRow?.status,
    thumbnailId: currentRow?.thumbnail?.id ?? '',
  };

  const form = useForm<UpdateProductRequest>({
    resolver: zodResolver(updateProductRequestSchema),
    defaultValues: defaultValues,
  });

  const onOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
      handleCancel();
    }
  };

  const onSubmit: SubmitHandler<UpdateProductRequest> = async (data) => {
    try {
      await mutateAsync({ id: currentRow!.id, payload: data });
      toast.success('Product updated successfully');
    } catch (error) {
      toast.error('Failed to update product');
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
            <DialogTitle className=" text-center">Update Product</DialogTitle>
            <DialogDescription className=" text-center">Fill the form below to update the product.</DialogDescription>
            <Separator />
          </DialogHeader>
          <div className="flex-1 min-h-0 overflow-y-auto pr-2 overscroll-contain scrollbar-thin scrollbar-thumb-neutral-300 scrollbar-track-transparent hover:scrollbar-thumb-neutral-400">
            <FieldGroup>
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={`name-input`}>Name</FieldLabel>
                    <Input
                      {...field}
                      id={`name-input`}
                      aria-invalid={fieldState.invalid}
                      placeholder="Name"
                      value={field.value ?? undefined}
                    />
                    <FieldError errors={[fieldState.error]} />
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
                      aria-rowcount={3}
                      placeholder="Description"
                      className=" max-h-42 overscroll-contain scrollbar-thin scrollbar-thumb-neutral-300 scrollbar-track-transparent hover:scrollbar-thumb-neutral-400"
                    />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />

              <Controller
                name="price"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="flex">
                    <FieldLabel htmlFor={`price-input`}>Price</FieldLabel>
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
                    <SelectForm field={field} options={ProductTextMapping} placeholder="Select status" label="Status" />
                  </Field>
                )}
              />

              <ImageUpload
                initMedia={currentRow?.thumbnail ?? null}
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

export default EditProduct;
