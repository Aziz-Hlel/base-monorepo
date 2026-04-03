import { logger } from '@/bootstrap/logger.init';
import { AccountEntityRequest } from '@/types/includes/account';
import { Auth } from 'firebase-admin/auth';
import { firebaseSession } from '../../bootstrap/firebase.init';
import { StrictDecodedIdToken } from '../../types/auth/StrictDecodedIdToken';
import { Claims, NewAdminCustomClaims } from '../../types/token/Claims';
import { handleFirebaseError, isFirebaseError } from '../err/firebase.errors';
import { FirebaseMapper } from './firebase.mapper';

const MAX_CLAIMS_SIZE = 1000;

function validateClaimsSize(claims: object) {
  const json = JSON.stringify(claims);
  const size = Buffer.byteLength(json, 'utf8');

  if (size > MAX_CLAIMS_SIZE / 2) logger.warn(`Custom claims too large: ${size} bytes`);
  if (size > MAX_CLAIMS_SIZE) throw new Error(`Custom claims too large: ${size} bytes`);
}

class FirebaseAuthService {
  private firebaseSession: Auth = firebaseSession;

  verifyToken = async (tokenId: string): Promise<StrictDecodedIdToken> => {
    try {
      const firebaseToken = await this.firebaseSession.verifyIdToken(tokenId);

      return firebaseToken;
    } catch (error: unknown) {
      if (isFirebaseError(error)) handleFirebaseError(error);

      logger.error(error, 'Unexpected verifyToken error:');
      throw error; // Not a Firebase error → rethrow untouched
    }
  };

  private setClaims = async ({ authId, claims }: { authId: string; claims: Claims }) => {
    try {
      validateClaimsSize(claims);
      await this.firebaseSession.setCustomUserClaims(authId, { claims });
      // TODO: invalidate any token for this user issued before Date.now()
    } catch (error: unknown) {
      if (isFirebaseError(error)) handleFirebaseError(error, { claims });

      logger.error(error, 'Unexpected setClaims error:');
      throw error; // Not a Firebase error → rethrow untouched
    }
  };

  setNewAdminCustomClaims = async ({
    authId,
    partialClaims,
  }: {
    authId: string;
    partialClaims: NewAdminCustomClaims;
  }) => {
    const claims: Claims = {
      ...partialClaims,
    };
    this.setClaims({ authId, claims });
  };

  setAccountClaims = async ({ authId, claims }: { authId: string; claims: Claims }) => {
    this.setClaims({ authId, claims });
  };

  validateClaims = ({ account, token }: { account: AccountEntityRequest; token: StrictDecodedIdToken }) => {
    const claims = (token as any).claims as Claims;
    console.log({ claims });
    if (!claims) return false;
    const validClaims: Claims = FirebaseMapper.toClaims({ account });
    console.log({ validClaims });

    return JSON.stringify(claims) === JSON.stringify(validClaims);
  };
}

export const firebaseAuthService = new FirebaseAuthService();
