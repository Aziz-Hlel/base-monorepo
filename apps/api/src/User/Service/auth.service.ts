import { firebaseService } from '../../firebase/service/firebase.service';
import UserMapper from '../mapper/user.mapper';
import { InternalServerError } from '../../err/customErrors';
import { DecodedIdTokenWithClaims } from '../../types/auth/DecodedIdTokenWithClaims';
import { userRepo } from '../repo/user.repo';
import { UserProfileResponse } from '@contracts/schemas/profile/UserProfileResponse';

class AuthService {
  private firebaseService = firebaseService;

  async registerUser(tokenId: string): Promise<UserProfileResponse> {
    const decodedToken = await this.firebaseService.verifyToken(tokenId);

    let email = decodedToken.email as string;
    decodedToken.picture;
    const isEmailExist = await userRepo.isUserEmailExists(email);

    if (isEmailExist)
      throw new InternalServerError(
        `New User registered with auth Provider but account email already exists in the system.
        authId: ${decodedToken.uid}, email: ${email}`,
      );

    const newUser = await UserMapper.createUser(decodedToken);

    await this.firebaseService.setCustomUserClaims(newUser);

    const userWithNoProfile = { ...newUser, profile: null };

    return UserMapper.toUserProfileResponse(userWithNoProfile, decodedToken);
  }

  async authenticateWithPassword(tokenId: string): Promise<UserProfileResponse> {
    const decodedToken = await this.firebaseService.verifyToken(tokenId);

    const userAuthId = decodedToken.uid;

    const user = await userRepo.getUserByAuthId(userAuthId);

    if (!user) {
      throw new InternalServerError(`User with authId ${userAuthId} does not exist in the system.`);
    }

    return UserMapper.toUserProfileResponse(user, decodedToken);
  }

  async authenticateWithProvider(tokenId: string): Promise<UserProfileResponse> {
    const decodedToken = await this.firebaseService.verifyToken(tokenId);

    const userAuthId = decodedToken.uid;
    let user = await userRepo.getUserByAuthId(userAuthId);

    if (!user) {
      user = await UserMapper.createUser(decodedToken);
      await this.firebaseService.setCustomUserClaims(user);
    }

    return UserMapper.toUserProfileResponse(user, decodedToken);
  }

  async me(decodedToken: DecodedIdTokenWithClaims): Promise<UserProfileResponse> {
    const userAuthId = decodedToken.uid;

    const user = await userRepo.getUserByAuthId(userAuthId);

    if (!user) {
      throw new InternalServerError(
        `User with authId ${userAuthId} registered in auth provider but does not exist in the system.`,
      );
    }
    const isValidClaims = this.firebaseService.validateCustomClaims(user, decodedToken);
    if (!isValidClaims) {
      await this.firebaseService.setCustomUserClaims(user);
    }
    return UserMapper.toUserProfileResponse(user, decodedToken);
  }
}

export const authService = new AuthService();
