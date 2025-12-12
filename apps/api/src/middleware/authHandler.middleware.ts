import { NextFunction, Response, Request } from 'express';
import { DecodedIdTokenWithClaims } from '../types/auth/DecodedIdTokenWithClaims';
import { firebaseService } from '../firebase/service/firebase.service';
import { AuthenticatedRequest } from '../types/auth/AuthenticatedRequest';

export const authHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = (req.headers as { authorization?: string }).authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Missing or invalid token' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new Error('Token not found');
    }
    const decoded = await firebaseService.verifyToken(token);

    (req as unknown as AuthenticatedRequest).user = decoded as DecodedIdTokenWithClaims;

    next();
    return;
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
