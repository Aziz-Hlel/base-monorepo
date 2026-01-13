import { NextFunction, Response, Request } from 'express';
import { DecodedIdTokenWithClaims } from '../types/auth/DecodedIdTokenWithClaims';
import { firebaseAuthService } from '../firebase/service/firebase.auth.service';
import { AuthenticatedRequest } from '../types/auth/AuthenticatedRequest';

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = (req.headers as { authorization?: string }).authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Missing or invalid token' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new Error('Token not found');
    }
    const decoded = await firebaseAuthService.verifyToken(token);

    (req as AuthenticatedRequest).user = decoded as DecodedIdTokenWithClaims;

    next();
    return;
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
