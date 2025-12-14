import type { CustomClaims } from './CustomClaims';
import type { StrictDecodedIdToken } from './StrictDecodedIdToken';

export type DecodedIdTokenWithClaims = StrictDecodedIdToken & CustomClaims;
