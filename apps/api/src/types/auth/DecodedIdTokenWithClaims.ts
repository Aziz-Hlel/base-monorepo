import { CustomClaims as Claims } from './CustomClaims';
import { StrictDecodedIdToken } from './StrictDecodedIdToken';

export type DecodedIdTokenWithClaims = StrictDecodedIdToken & { claims: Claims };
