import { logger } from '@/bootstrap/logger.init';
import { ConflictError, NotFoundError, UnauthorizedError } from '@/err/customErrors';
import { firebaseAuthService } from '@/firebase/service/firebase.auth.service';
import { FirebaseMapper } from '@/firebase/service/firebase.mapper';
import { globalMediaService, MediaService } from '@/media/media.service';
import { DecodedIdTokenWithClaims } from '@/types/auth/DecodedTokenWithClaims';
import { accountInclude } from '@/types/includes/account';
import { AccountResponse } from '@repo/contracts/schemas/account/accountResponse';
import { AccountHelper } from './account.helper';
import { AccountMapper } from './account.mapper';
import { AccountRepo } from './account.repo';
import { AccountRole } from '@/generated/prisma/enums';
import { AuthResponse } from '@repo/contracts/schemas/auth/authResponse';

export class AccountService {
  constructor(
    private readonly accountRepo: AccountRepo,
    private readonly accountHelper: AccountHelper,
  ) {}

  async createAdminAccountWithPassword(token: string): Promise<AuthResponse> {
    const decodedToken = await firebaseAuthService.verifyToken(token);

    const userAuthId = decodedToken.uid;

    const account = await this.accountRepo.isAccountExists({ authId: userAuthId });

    if (account) {
      throw new ConflictError({ message: 'Account already exists', clientDisplayMessage: 'Account already exists' });
    }

    const newAccount = await this.accountHelper.createAdminAccount(decodedToken);

    const partialClaims = FirebaseMapper.toNewAccountClaims({ account: newAccount });

    firebaseAuthService.setNewAdminCustomClaims({ authId: userAuthId, partialClaims });

    const accountResponse = AccountMapper.toNewAccountResponse({ account: newAccount });

    return accountResponse;
  }

  async authenticateWithPassword(token: string): Promise<AuthResponse> {
    const decodedToken = await firebaseAuthService.verifyTokenWithClaims(token);

    const userAuthId = decodedToken.uid;

    const account = await this.accountRepo.getAccountByAuthId({
      authId: userAuthId,
      include: accountInclude,
    });

    if (!account) {
      const newAccount = await this.accountHelper.createEmergencyAccount(decodedToken);
      logger.fatal(newAccount, 'Account exists in the auth provider but not in the database is just been created');
      throw new NotFoundError(`Account Not found`);
    }

    if (account.users.length === 0 && account.role === AccountRole.USER) {
      throw new NotFoundError(`Account Not found`);
    }

    const accountAvatar = globalMediaService.generateMediaResponse(account.avatar);

    const accountResponse = AccountMapper.toAuthResponse2({ account, avatar: accountAvatar });

    return accountResponse;
  }

  async authenticateWithProvider(token: string): Promise<AuthResponse> {
    const decodedToken = await firebaseAuthService.verifyTokenWithClaims(token);

    const userAuthId = decodedToken.uid;

    const account = await this.accountRepo.getAccountByAuthId({
      authId: userAuthId,
      include: accountInclude,
    });

    if (!account) {
      const newAccount = await this.accountHelper.createEmergencyAccount(decodedToken);
      const partialClaims = FirebaseMapper.toNewAccountClaims({ account: newAccount });

      firebaseAuthService.setNewAdminCustomClaims({ authId: userAuthId, partialClaims });
      throw new NotFoundError(`Account Not found`);
    }

    if (account.users.length === 0) {
      throw new NotFoundError(`Account Not found`);
    }

    const accountAvatar = globalMediaService.generateMediaResponse(account.avatar);

    const accountResponse = AccountMapper.toAuthResponse2({ account, avatar: accountAvatar });

    return accountResponse;
  }

  me = async (decodedToken: DecodedIdTokenWithClaims): Promise<AuthResponse> => {
    const userAuthId = decodedToken.uid;

    const account = await this.accountRepo.getAccountByAuthId({
      authId: userAuthId,
      include: accountInclude,
    });

    if (!account) {
      logger.fatal(account, 'Client send a valid token but account not found in the database');
      throw new NotFoundError(`Account Not found`);
    }
    const isValidClaims = firebaseAuthService.validateClaims({ account, token: decodedToken });
    if (!isValidClaims) {
      throw new UnauthorizedError(`Invalid claims`);
    }

    const accountAvatar = globalMediaService.generateMediaResponse(account.avatar);

    const accountResponse = AccountMapper.toAuthResponse2({ account, avatar: accountAvatar });

    return accountResponse;
  };
}
