import { FirebaseError } from 'firebase-admin/lib/utils/error';
import { ConflictError, UnauthorizedError } from '../../err/customErrors';

export const isFirebaseError = (err: unknown): err is FirebaseError => {
  return typeof err === 'object' && err !== null && 'code' in err && typeof (err as any).code === 'string';
};

export const handleFirebaseError = (error: FirebaseError): never => {
  switch (error.code) {
    case 'auth/user-disabled':
      throw new ConflictError('User account is disabled.');
    case 'auth/id-token-revoked':
      throw new ConflictError('Token has been revoked.');
    case 'auth/id-token-expired':
      throw new UnauthorizedError('Token has expired.');
    default:
      console.error('❌ ERROR : Unhandled Firebase error:', error);
      throw error;
  }
};
