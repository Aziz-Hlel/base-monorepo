import { CustomClaims } from './CustomClaims';
import { StrictDecodedIdToken } from './StrictDecodedIdToken';

export type DecodedIdTokenWithClaims = StrictDecodedIdToken & { claims: CustomClaims };
