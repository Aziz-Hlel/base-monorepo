import { useSelectedRow } from '../context/selected-row-provider';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
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
import {
  createUserProfileRequestSchema,
  type CreateUserProfileSchemaOutput,
} from '@contracts/schemas/profile/createUserProfileRequest';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { PhoneInput } from '@/components/ui/phone-input';
import userService from '@/Api/service/userService';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

const AddUser = () => {
  const { handleCancel } = useSelectedRow();
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationKey: ['users', 'create'],
    mutationFn: userService.createUserProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'], exact: false });
      handleCancel();
    },
  });
  const defaultValues: CreateUserProfileSchemaOutput = {
    username: '',
    email: '',
    password: '',
    role: 'USER',
    status: 'ACTIVE',
    profile: {
      phoneNumber: null,
      address: null,
    },
  };
  const form = useForm<CreateUserProfileSchemaOutput>({
    resolver: zodResolver(createUserProfileRequestSchema),
    defaultValues: defaultValues,
  });
  const isPending = false;
  const onOpenChange = (open: boolean) => {
    if (!open) {
      handleCancel();
    }
  };

  const onSubmit: SubmitHandler<CreateUserProfileSchemaOutput> = async (data) => {
    try {
      await mutateAsync(data);
      toast.success('User created successfully');
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError && error.response?.status === 409) {
        console.log('t5l');
        form.setError('email', { message: 'Email already exists' });
        return;
      }
      toast.error('Failed to create user');
    }
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={true}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <DialogHeader>
            <DialogTitle>Create User</DialogTitle>
            <DialogDescription>Fill the form below to create a new user.</DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Controller
              name="username"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={`username-input`}>Username</FieldLabel>
                  <Input {...field} id={`username-input`} aria-invalid={fieldState.invalid} placeholder="Username" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={`email-input`}>Email</FieldLabel>
                  <Input {...field} id={`email-input`} aria-invalid={fieldState.invalid} placeholder="Email" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={`password-input`}>Password</FieldLabel>
                  <Input
                    {...field}
                    id={`password-input`}
                    aria-invalid={fieldState.invalid}
                    placeholder="Password"
                    type="password"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="profile.phoneNumber"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={`phoneNumber-input`}>Phone Number</FieldLabel>
                  <PhoneInput
                    {...field}
                    value={field.value ?? undefined}
                    defaultCountry="BH"
                    id={`phoneNumber-input`}
                    aria-invalid={fieldState.invalid}
                    placeholder="Phone Number"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="profile.address"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={`address-input`}>Address</FieldLabel>
                  <Input
                    {...field}
                    value={field.value ?? ''}
                    id={`address-input`}
                    aria-invalid={fieldState.invalid}
                    placeholder="Address"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">{isPending ? <Spinner /> : <span>Save changes</span>}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddUser;
