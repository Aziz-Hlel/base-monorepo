import { UserCreateInput } from '@/generated/prisma/models';
import { UserRepo } from '../repo/user.repo';
import { firebaseUserService } from '@/firebase/service/firebase.user.service';
import { firebaseAuthService } from '@/firebase/service/firebase.auth.service';
import { User } from '@/generated/prisma/client';

export class UserService {
  constructor(private readonly userRepo: UserRepo) {}

  async isUserEmailExists(email: string) {
    return await this.userRepo.isUserEmailExists(email);
  }

  async createUser(user: UserCreateInput) {
    return await this.userRepo.createUser(user);
  }

  createAuthUserAndUser = async (params: {
    email: string;
    password: string;
    username: string;
  }): Promise<{ success: false; cause: 'EMAIL_ALREADY_EXISTS'; error: string } | { success: true; user: User }> => {
    const existingUser = await this.findByEmail(params.email);
    if (existingUser) {
      return { success: false, cause: 'EMAIL_ALREADY_EXISTS', error: 'User already exists' };
    }

    const userRecord = await firebaseUserService.createUser({
      email: params.email,
      password: params.password,
      displayName: params.username,
    });

    const user = await this.createUser({
      authId: userRecord.uid,
      email: params.email,
      username: params.username,
      provider: 'PASSWORD',
    });

    await firebaseAuthService.setCustomUserClaims({
      userId: user.id,
      userAuthId: userRecord.uid,
      userRole: user.role,
    });

    return { success: true, user } as const;
  };

  async findOrCreateUser(user: UserCreateInput) {
    const existingUser = await this.userRepo.getUserByAuthId(user.authId);
    if (existingUser) {
      return { user: existingUser, type: 'EXISTING' };
    }
    const createdUser = await this.userRepo.createUser(user);
    return { user: createdUser, type: 'CREATED' };
  }

  findByEmail = async (email: string) => {
    return await this.userRepo.findByEmail(email);
  };

  async getUserById(id: string) {
    return await this.userRepo.getUserById(id);
  }

  async getUserByAuthId(authId: string) {
    return await this.userRepo.getUserByAuthId(authId);
  }
}
