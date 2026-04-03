import { logger } from '@/bootstrap/logger.init';
import { AccountEntityRequest } from '@/types/includes/account';
import { Auth } from 'firebase-admin/auth';
import { firebaseSession } from '../../bootstrap/firebase.init';
import { StrictDecodedIdToken } from '../../types/auth/StrictDecodedIdToken';
import { Claims, claimsSchema, NewAdminCustomClaims } from '../../types/token/Claims';
import { handleFirebaseError, isFirebaseError } from '../err/firebase.errors';
import { FirebaseMapper } from './firebase.mapper';
import { DecodedIdTokenWithClaims } from '@/types/auth/DecodedTokenWithClaims';
import { UnauthorizedError } from '@/err/customErrors';

const MAX_CLAIMS_SIZE = 1000;

function validateClaimsSize(claims: object) {
  const json = JSON.stringify(claims);
  const size = Buffer.byteLength(json, 'utf8');

  if (size > MAX_CLAIMS_SIZE / 2) logger.warn(`Custom claims too large: ${size} bytes`);
  if (size > MAX_CLAIMS_SIZE) throw new Error(`Custom claims too large: ${size} bytes`);
}

class FirebaseAuthService {
  private firebaseSession: Auth = firebaseSession;

  private isTokenFormatValid = (token: string) => {
    return typeof token === 'string' && token.split('.').length === 3;
  };
  verifyToken = async (token: string): Promise<StrictDecodedIdToken> => {
    try {
      if (!this.isTokenFormatValid(token)) {
        logger.error({ token }, 'Invalid token format');
        throw new UnauthorizedError('Invalid token');
      }
      const firebaseToken = await this.firebaseSession.verifyIdToken(token);

      return firebaseToken;
    } catch (error: unknown) {
      if (isFirebaseError(error)) handleFirebaseError(error);

      logger.error({ error }, 'Unexpected verifyToken error:');
      throw error; // Not a Firebase error → rethrow untouched
    }
  };

  verifyTokenWithClaims = async (token: string): Promise<DecodedIdTokenWithClaims> => {
    try {
      if (!this.isTokenFormatValid(token)) {
        logger.error({ token }, 'Invalid token format');
        throw new UnauthorizedError('Invalid token');
      }
      const firebaseToken = await this.firebaseSession.verifyIdToken(token);
      this.validateClaimsSchema(firebaseToken.claims);
      return firebaseToken as DecodedIdTokenWithClaims;
    } catch (error: unknown) {
      if (isFirebaseError(error)) handleFirebaseError(error);

      logger.error({ error }, 'Unexpected verifyToken error:');
      throw error; // Not a Firebase error → rethrow untouched
    }
  };

  private setClaims = async ({ authId, claims }: { authId: string; claims: Claims }) => {
    try {
      validateClaimsSize(claims);
      await this.firebaseSession.setCustomUserClaims(authId, { claims });
      this.validateClaimsSchema(claims);
      // TODO: invalidate any token for this user issued before Date.now()
    } catch (error: unknown) {
      if (isFirebaseError(error)) handleFirebaseError(error, { claims });

      logger.error({ error }, 'Unexpected setClaims error:');
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

  private validateClaimsSchema = (claims: Object | undefined): claims is Claims => {
    const result = claimsSchema.safeParse(claims);
    if (!result.success) {
      throw new UnauthorizedError('Invalid claims schema');
    }
    return true;
  };

  validateClaims = ({ account, token }: { account: AccountEntityRequest; token: StrictDecodedIdToken }) => {
    const claims = (token as any).claims as Claims;
    if (!claims) return false;
    const validClaims: Claims = FirebaseMapper.toClaims({ account });

    return JSON.stringify(claims) === JSON.stringify(validClaims);
  };
}

export const firebaseAuthService = new FirebaseAuthService();
