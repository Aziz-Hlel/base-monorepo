import { UserRecord } from 'firebase-admin/auth';
import { handleFirebaseError, isFirebaseError } from '../err/firebase.errors';
import { logger } from '@/bootstrap/logger.init';
import { firebaseSession } from '@/bootstrap/firebase.init';
import { firebaseAuthService } from './firebase.auth.service';
import { Role } from '@/generated/prisma/enums';
import { SafeResponse } from '@/types/in/SafeResponse';
import { BadRequestError } from '@/err/customErrors';

class FirebaseUserService {
  private firebaseSession = firebaseSession;

  async safeGetUserByEmail(email: string): Promise<SafeResponse<UserRecord, 'User not found'>> {
    try {
      const userRecord = await this.firebaseSession.getUserByEmail(email);
      return {
        success: true,
        data: userRecord,
      };
    } catch (error: unknown) {
      if (isFirebaseError(error) && error.code === 'auth/user-not-found') {
        return {
          success: false,
          error: 'User not found' as const,
        };
      }
      if (isFirebaseError(error)) {
        handleFirebaseError(error);
      }
      logger.error(error, 'Unexpected safeGetUserByEmail error:');
      throw error;
    }
  }

  async createUser({
    email,
    password,
    displayName,
    role,
  }: {
    email: string;
    password: string;
    displayName: string;
    role: Role;
  }): Promise<UserRecord> {
    try {
      const userExists = await this.safeGetUserByEmail(email);
      if (userExists.success) {
        // ! not quite my tempo, this will return the existed user in the auth provider to continue the flow and create the user, better than throwing an erro but the password will still whatever it was set to before
        return userExists.data;
      }

      const userRecord = await this.firebaseSession.createUser({
        email,
        password,
        displayName,
      });
      firebaseAuthService.setCustomUserClaims({
        userId: userRecord.uid,
        userAuthId: userRecord.uid,
        userRole: role,
      });

      return userRecord;
    } catch (error: unknown) {
      if (isFirebaseError(error)) handleFirebaseError(error);

      logger.error(error, 'Unexpected createUser error:');
      throw error;
    }
  }

  async disableUser(authId: string): Promise<void> {
    try {
      await this.firebaseSession.updateUser(authId, { disabled: true });
      await this.firebaseSession.revokeRefreshTokens(authId);
    } catch (error: unknown) {
      if (isFirebaseError(error)) handleFirebaseError(error);

      logger.error(error, 'Unexpected disableUser error:');
      throw error;
    }
  }

  async enableUser(authId: string): Promise<void> {
    try {
      await this.firebaseSession.updateUser(authId, {
        disabled: false,
      });
      await this.firebaseSession.revokeRefreshTokens(authId);
    } catch (error: unknown) {
      if (isFirebaseError(error)) handleFirebaseError(error);

      logger.error(error, 'Unexpected enableUser error:');
      throw error;
    }
  }

  async deleteUser(authId: string): Promise<void> {
    try {
      await this.firebaseSession.deleteUser(authId);
      await this.firebaseSession.revokeRefreshTokens(authId);
    } catch (error: unknown) {
      if (isFirebaseError(error)) handleFirebaseError(error);

      logger.error(error, 'Unexpected deleteUser error:');
      throw error;
    }
  }
}

export const firebaseUserService = new FirebaseUserService();
