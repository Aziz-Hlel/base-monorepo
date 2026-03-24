import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';
import type { MediaResponse } from '@repo/contracts/schemas/media/MediaResponse';
import type { CreateNotificationRequest } from '@repo/contracts/schemas/notification/createNotification';
import { Controller, type UseFormReturn } from 'react-hook-form';

const FormUI = ({
  form,
  initMedia,
  thumbnailErrors,
  clearMediaErrors,
  handleThumbnailUpload,
}: {
  form: UseFormReturn<CreateNotificationRequest>;
  initMedia: MediaResponse | null;
  thumbnailErrors: (string | undefined)[];
  clearMediaErrors: () => void;
  handleThumbnailUpload: (newMediaId: string | null) => void;
}) => {
  return (
    <>
      <Controller
        name="description"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={`description-input`}>Description</FieldLabel>
            <Textarea {...field} id={`description-input`} aria-invalid={fieldState.invalid} placeholder="Description" />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <ImageUpload2
        initMedia={initMedia}
        mediaErrors={thumbnailErrors}
        clearMediaErrors={clearMediaErrors}
        handleMediaUpload={handleThumbnailUpload}
        form={form}
        fieldName="thumbnailId"
      />
    </>
  );
};

export default FormUI;
