import { UserRecord } from 'firebase-admin/auth';
import { handleFirebaseError, isFirebaseError } from '../err/firebase.errors';
import { logger } from '@/bootstrap/logger.init';
import { firebaseSession } from '@/bootstrap/firebase.init';
import { firebaseAuthService } from './firebase.auth.service';
import { Role } from '@/generated/prisma/enums';

class FirebaseUserService {
  private firebaseSession = firebaseSession;

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
