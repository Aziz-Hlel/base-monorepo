import { CustomClaims as Claims } from './Claims';
import { StrictDecodedIdToken } from './StrictDecodedIdToken';

export type DecodedIdTokenWithClaims = StrictDecodedIdToken & { claims: Claims };
