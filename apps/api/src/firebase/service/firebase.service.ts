import { handleFirebaseError, isFirebaseError } from '../err/fireabase.errors';
import { CustomClaims } from '../../types/auth/CustomClaims';
import { User } from '../../generated/prisma/client';
import { StrictDecodedIdToken } from '../../types/auth/StrictDecodedIdToken';
import { Auth } from 'firebase-admin/auth';
import { firebaseSession } from '../../bootstrap/firebase.init';

class FirebaseService {
  private firebaseSession: Auth = firebaseSession;

  async verifyToken(tokenId: string): Promise<StrictDecodedIdToken> {
    try {
      const firebaseToken = await this.firebaseSession.verifyIdToken(tokenId);
      return firebaseToken;
    } catch (error: unknown) {
      if (isFirebaseError(error)) handleFirebaseError(error);

      console.error('Unexpected verifyToken error:', error);
      throw error; // Not a Firebase error → rethrow untouched
    }
  }

  async setCustomUserClaims(user: User): Promise<void> {
    const claims: CustomClaims = {
      id: user.id,
      role: user.role,
    };
    const authId = user.authId;
    try {
      await this.firebaseSession.setCustomUserClaims(authId, { claims });
    } catch (error: unknown) {
      if (isFirebaseError(error)) handleFirebaseError(error);

      console.error('Unexpected setCustomUserClaims error:', error);
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

export const firebaseService = new FirebaseService();
