import { firebaseAuthService } from '../../../firebase/service/firebase.auth.service';
import UserMapper from '../mapper/user.mapper';
import { InternalServerError } from '../../../err/customErrors';
import { DecodedIdTokenWithClaims } from '../../../types/auth/DecodedIdTokenWithClaims';
import { UserProfileResponse } from '@repo/contracts/schemas/profile/UserProfileResponse';
import { UserRepo } from '../repo/user.repo';

export interface IAuthService {
  registerUser(tokenId: string): Promise<UserProfileResponse>;
  authenticateWithPassword(tokenId: string): Promise<UserProfileResponse>;
  authenticateWithProvider(tokenId: string): Promise<UserProfileResponse>;
  me(decodedToken: DecodedIdTokenWithClaims): Promise<UserProfileResponse>;
}

export class AuthService implements IAuthService {
  constructor(private readonly userRepo: UserRepo) {}
  private firebaseService = firebaseAuthService;

  async registerUser(tokenId: string): Promise<UserProfileResponse> {
    const decodedToken = await this.firebaseService.verifyToken(tokenId);

    let email = decodedToken.email as string;

    const isEmailExist = await this.userRepo.isUserEmailExists(email);

    if (isEmailExist)
      throw new InternalServerError(
        `New User registered with auth Provider but account email already exists in the system.
        authId: ${decodedToken.uid}, email: ${email}`,
      );

    const userToCreate = UserMapper.toUserCreateInput(decodedToken);
    const newUser = await this.userRepo.createUser(userToCreate);

    await this.firebaseService.setCustomUserClaims({
      userId: newUser.id,
      userAuthId: newUser.authId,
      userRole: newUser.role,
    });

    const userWithNoProfile = { ...newUser, profile: null };

    return UserMapper.toUserProfileResponse(userWithNoProfile, decodedToken.picture || null);
  }

  async authenticateWithPassword(tokenId: string): Promise<UserProfileResponse> {
    const decodedToken = await this.firebaseService.verifyToken(tokenId);

    const userAuthId = decodedToken.uid;

    const user = await this.userRepo.getUserByAuthId(userAuthId);

    if (!user) {
      throw new InternalServerError(`User with authId ${userAuthId} does not exist in the system.`);
    }

    return UserMapper.toUserProfileResponse(user, decodedToken.picture || null);
  }

  async authenticateWithProvider(tokenId: string): Promise<UserProfileResponse> {
    const decodedToken = await this.firebaseService.verifyToken(tokenId);

    const userAuthId = decodedToken.uid;
    console.log('user auth id', userAuthId);
    let user = await this.userRepo.getUserByAuthId(userAuthId);

    if (!user) {
      const userToCreate = UserMapper.toUserCreateInput(decodedToken);
      user = await this.userRepo.createUser(userToCreate);
      await this.firebaseService.setCustomUserClaims({
        userId: user.id,
        userAuthId: user.authId,
        userRole: user.role,
      });
    }

    return UserMapper.toUserProfileResponse(user, decodedToken.picture || null);
  }

  async me(decodedToken: DecodedIdTokenWithClaims): Promise<UserProfileResponse> {
    const userAuthId = decodedToken.uid;

    const user = await this.userRepo.getUserByAuthId(userAuthId);

    if (!user) {
      throw new InternalServerError(
        `User with authId ${userAuthId} registered in auth provider but does not exist in the system.`,
      );
    }
    const isValidClaims = this.firebaseService.validateCustomClaims(user, decodedToken);
    if (!isValidClaims) {
      await this.firebaseService.setCustomUserClaims({
        userId: user.id,
        userAuthId: user.authId,
        userRole: user.role,
      });
    }
    return UserMapper.toUserProfileResponse(user, decodedToken.picture || null);
  }
}
