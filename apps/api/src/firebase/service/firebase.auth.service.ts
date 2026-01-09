import { handleFirebaseError, isFirebaseError } from '../err/firebase.errors';
import { CustomClaims } from '../../types/auth/CustomClaims';
import { Role, User } from '../../generated/prisma/client';
import { StrictDecodedIdToken } from '../../types/auth/StrictDecodedIdToken';
import { Auth } from 'firebase-admin/auth';
import { firebaseSession } from '../../bootstrap/firebase.init';
import { logger } from '@/bootstrap/logger.init';

class FirebaseAuthService {
  private firebaseSession: Auth = firebaseSession;

  async verifyToken(tokenId: string): Promise<StrictDecodedIdToken> {
    try {
      const firebaseToken = await this.firebaseSession.verifyIdToken(tokenId);

      return firebaseToken;
    } catch (error: unknown) {
      if (isFirebaseError(error)) handleFirebaseError(error);

      logger.error(error, 'Unexpected verifyToken error:');
      throw error; // Not a Firebase error → rethrow untouched
    }
  }

  async setCustomUserClaims({
    userId,
    userAuthId,
    userRole,
  }: {
    userId: string;
    userAuthId: string;
    userRole: Role;
  }): Promise<void> {
    const claims: CustomClaims = {
      id: userId,
      role: userRole,
    };
    const authId = userAuthId;
    try {
      await this.firebaseSession.setCustomUserClaims(authId, { claims });
    } catch (error: unknown) {
      if (isFirebaseError(error)) handleFirebaseError(error);

      logger.error(error, 'Unexpected setCustomUserClaims error:');
      throw error; // Not a Firebase error → rethrow untouched
    }
  }

  validateCustomClaims(user: User, tokenId: StrictDecodedIdToken) {
    const claims = (tokenId as any).claims as CustomClaims;

    if (!claims) return false;
    const CustomClaims: CustomClaims = {
      id: user.id,
      role: user.role,
    };

    return JSON.stringify(claims) === JSON.stringify(CustomClaims);
  }
}

export const firebaseAuthService = new FirebaseAuthService();
