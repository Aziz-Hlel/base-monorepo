import { DecodedIdTokenWithClaims } from '@/types/auth/DecodedIdTokenWithClaims';
import { CreateProfileRequest } from '@repo/contracts/schemas/profile/createProfileRequest';
import { UserRepo } from '../repo/user.repo';
import { BadRequestError, ConflictError } from '@/err/customErrors';
import { ProfileRepo } from '../repo/profile.repo';
import { UserProfileResponse } from '@repo/contracts/schemas/profile/UserProfileResponse';
import { ProfileMapper } from '../mapper/profile.mapper';

export interface IProfileService {
  create(token: DecodedIdTokenWithClaims, schema: CreateProfileRequest): Promise<UserProfileResponse>;
}

export class ProfileService implements IProfileService {
  constructor(
    private readonly userRepo: UserRepo,
    private readonly profileRepo: ProfileRepo,
  ) {}

  async create(token: DecodedIdTokenWithClaims, schema: CreateProfileRequest): Promise<UserProfileResponse> {
    const userId = token.uid;

    const hasProfile = await this.userRepo.isUserHasProfile(userId);

    if (hasProfile instanceof Error) {
      throw new BadRequestError('User not found');
    }

    if (hasProfile) {
      throw new ConflictError('User already has a profile');
    }

    const profile = await this.profileRepo.create(userId, schema);

    const userProfileResponse = ProfileMapper.toUserProfileResponse(profile, token);

    return userProfileResponse;
  }
}
