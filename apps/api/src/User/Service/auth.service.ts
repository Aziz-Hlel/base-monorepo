import { prisma } from '../../bootstrap/db.init';
import { firebaseService } from '../../firebase/service/firebase.service';
import UserMapper from '../mapper/user.mapper';
import { InternalServerError } from '../../err/customErrors';
import { DecodedIdTokenWithClaims } from '../../types/auth/DecodedIdTokenWithClaims';
import { userRespo } from '../repo/user.repo';
import { UserProfileResponse } from '@contracts/types/user/UserProfileResponse';

class AuthService {
  private firebaseService = firebaseService;

  async registerUser(tokenId: string): Promise<UserProfileResponse> {
    const decodedToken = await this.firebaseService.verifyToken(tokenId);

    let email = decodedToken.email as string;
    decodedToken.picture;
    const isEmailExist = await userRespo.isUserEmailExists(email);

    if (isEmailExist)
      throw new InternalServerError(
        `New User registred with auth Provider but account email already exists in the system.
        authId: ${decodedToken.uid}, email: ${email}`,
      );

    const newUser = await prisma.user.create({
      data: UserMapper.toUserCreateInput(decodedToken),
    });

    await this.firebaseService.setCustomUserClaims(newUser);

    return UserMapper.toUserResponseDto(newUser, decodedToken);
  }

  async loginUser(tokenId: string): Promise<UserProfileResponse> {
    const decodedToken = await this.firebaseService.verifyToken(tokenId);

    const userAuthId = decodedToken.uid;

    const user = await userRespo.getUserByAuthId(userAuthId);

    if (!user) {
      throw new InternalServerError(`User with authId ${userAuthId} does not exist in the system.`);
    }

    return UserMapper.toUserResponseDto(user, decodedToken);
  }

  async authenticateWithProvider(tokenId: string): Promise<UserProfileResponse> {
    const decodedToken = await this.firebaseService.verifyToken(tokenId);

    const userAuthId = decodedToken.uid;
    let user = await userRespo.getUserByAuthId(userAuthId);

    if (!user) {
      user = await prisma.user.create({
        data: UserMapper.toUserCreateInput(decodedToken),
      });
      await this.firebaseService.setCustomUserClaims(user);
    }

    return UserMapper.toUserResponseDto(user, decodedToken);
  }

  async me(decodedToken: DecodedIdTokenWithClaims): Promise<UserProfileResponse> {
    const userAuthId = decodedToken.uid;

    const user = await userRespo.getUserByAuthId(userAuthId);

    if (!user) {
      throw new InternalServerError(
        `User with authId ${userAuthId} registred in auth provider but does not exist in the system.`,
      );
    }
    const isValidClaims = this.firebaseService.validateCustomClaims(user, decodedToken);
    if (!isValidClaims) {
      await this.firebaseService.setCustomUserClaims(user);
    }
    return UserMapper.toUserResponseDto(user, decodedToken);
  }
}

export const authService = new AuthService();
