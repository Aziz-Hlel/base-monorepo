import MediaUpload from '@/components/custom/MediaUpload/ImageUpload2';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import type { MediaResponse } from '@repo/contracts/schemas/media/MediaResponse';
import type { CreateNotificationRequest } from '@repo/contracts/schemas/notification/createNotification';
import { notificationRecipientType } from '@repo/contracts/schemas/notification/types/notificationRecipient';
import { Controller, type UseFormReturn } from 'react-hook-form';
const FormUI = ({
  form,
  initMedia,
}: {
  form: UseFormReturn<CreateNotificationRequest>;
  initMedia: MediaResponse | null;
}) => {
  return (
    <>
      <Controller
        name='description'
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={`description-input`}>Description</FieldLabel>
            <Textarea
              {...field}
              value={field.value ?? undefined}
              id={`description-input`}
              aria-invalid={fieldState.invalid}
              placeholder='Description'
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name='recipients.type'
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={`recipients-type-input`}>Recipients</FieldLabel>
            <Tabs {...field} value={field.value} onValueChange={field.onChange} className='w-100'>
              <TabsList>
                {Object.values(notificationRecipientType).map((type) => (
                  <TabsTrigger key={type} value={type}>
                    {type}
                  </TabsTrigger>
                ))}
              </TabsList>
              {Object.values(notificationRecipientType).map((type) => (
                <TabsContent key={type} value={type}>
                  {type}
                </TabsContent>
              ))}
            </Tabs>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <MediaUpload initMedia={initMedia} form={form} fieldName='payload.en.data' mediaErrors={[]} />
    </>
  );
};

export default FormUI;
