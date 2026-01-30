import { useSelectedRow } from '../context/selected-row-provider';
import { useUser } from '@/context/UserContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import userService from '@/Api/service/userService';
import {
  updateUserProfileRequestSchema,
  type UpdateUserProfileRequest,
} from '@contracts/schemas/profile/updateUserProfileRequest';
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
import { PhoneInput } from '@/components/ui/phone-input';
import { Spinner } from '@/components/ui/spinner';
import RolesTextMapping from '@/EnumTextMapping/RolesTextMapping';
import PERMISSION_SCORE from '@contracts/utils/PermissionScore';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';

const EditUser = () => {
  const { handleCancel, currentRow, openDialog } = useSelectedRow();
  const queryClient = useQueryClient();

  const { userRole: role } = useUser();

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['users', 'update'],
    mutationFn: userService.updateUserProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'], exact: false });
      handleCancel();
    },
  });

  const defaultValues: UpdateUserProfileRequest = {
    username: currentRow!.username,
    email: currentRow!.email,
    role: currentRow!.role,
    status: currentRow!.status,
    profile: {
      phoneNumber: currentRow!.profile?.phoneNumber ?? null,
      address: currentRow!.profile?.address ?? null,
    },
  };

  const form = useForm<UpdateUserProfileRequest>({
    resolver: zodResolver(updateUserProfileRequestSchema),
    defaultValues: defaultValues,
  });

  const onOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
      handleCancel();
    }
  };

  const onSubmit: SubmitHandler<UpdateUserProfileRequest> = async (data) => {
    try {
      await mutateAsync({ id: currentRow!.id, payload: data });
      toast.success('User updated successfully');
    } catch (error) {
      toast.error('Failed to update user');
    }
  };

  const dialogIsOpen = openDialog === 'edit';
  console.log(form.formState.errors);
  return (
    <Dialog onOpenChange={onOpenChange} open={dialogIsOpen}>
      <DialogContent className="sm:max-w-106.25">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <DialogHeader>
            <DialogTitle className=" text-center">Edit User</DialogTitle>
            <DialogDescription className=" text-center">Fill the form below to edit the user.</DialogDescription>
            <Separator />
          </DialogHeader>

          <FieldGroup>
            <Controller
              name="username"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={`username-input`}>Username</FieldLabel>
                  <Input
                    {...field}
                    id={`username-input`}
                    aria-invalid={fieldState.invalid}
                    placeholder="Username"
                    value={field.value ?? undefined}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="cursor-not-allowed">
                  <FieldLabel htmlFor={`email-input`}>Email</FieldLabel>
                  <Input
                    {...field}
                    id={`email-input`}
                    aria-invalid={fieldState.invalid}
                    placeholder="Email"
                    aria-disabled
                    disabled
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <Controller
              name="role"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="flex">
                  <FieldLabel htmlFor={`role-input`}>Role</FieldLabel>

                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      if (PERMISSION_SCORE[value as keyof typeof PERMISSION_SCORE] <= PERMISSION_SCORE[role])
                        field.onChange(value);
                    }}
                  >
                    <SelectTrigger className="w-45">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Roles</SelectLabel>

                        {Object.entries(RolesTextMapping).map(([key, value]) => {
                          const permissionScore = PERMISSION_SCORE[key as keyof typeof PERMISSION_SCORE];

                          if (permissionScore === undefined) return null;

                          const isDisabled = PERMISSION_SCORE[role] < permissionScore;

                          if (isDisabled) {
                            return (
                              <Tooltip key={key}>
                                <TooltipTrigger asChild>
                                  <SelectItem
                                    value={key}
                                    aria-disabled
                                    onSelect={(e) => e.preventDefault()}
                                    className="opacity-50 cursor-not-allowed"
                                  >
                                    {value}
                                  </SelectItem>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>You do not have permission to select this role.</p>
                                </TooltipContent>
                              </Tooltip>
                            );
                          }

                          return (
                            <SelectItem key={key} value={key}>
                              {value}
                            </SelectItem>
                          );
                        })}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
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
            <Button type="submit" className=" w-28" disabled={isPending}>
              {isPending ? <Spinner /> : <span>Save changes</span>}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUser;
