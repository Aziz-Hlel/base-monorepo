import { logger } from '@/bootstrap/logger.init';
import { ConflictError, NotFoundError, UnauthorizedError } from '@/err/customErrors';
import { firebaseAuthService } from '@/firebase/service/firebase.auth.service';
import { FirebaseMapper } from '@/firebase/service/firebase.mapper';
import { AccountRole } from '@/generated/prisma/enums';
import { globalMediaService } from '@/media/media.service';
import { DecodedIdTokenWithClaims } from '@/types/auth/DecodedTokenWithClaims';
import { accountInclude } from '@/types/includes/account';
import { AuthResponse } from '@repo/contracts/schemas/auth/authResponse';
import { AccountHelper } from './account.helper';
import { AccountMapper } from './account.mapper';
import { AccountRepo } from './account.repo';
import { AccountService } from './account.serivce';

export class AccountAppService {
  constructor(
    private readonly accountRepo: AccountRepo,
    private readonly accountService: AccountService,
  ) {}

  async createAdminAccountWithPassword(token: string): Promise<AuthResponse> {
    const decodedToken = await firebaseAuthService.verifyToken(token);

    const { account, type } = await this.accountService.findOrCreateAccount({
      accountDetails: {
        email: decodedToken.email!,
        role: AccountRole.ADMIN,
      },
    });

    if (type === 'EXISTING') {
      throw new ConflictError({ message: 'Account already exists', clientMessage: 'Account already exists' });
    }

    const accountResponse = AccountMapper.toNewAccountResponse({ account });

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
      const newAccount = await this.accountService.createEmergencyAccount(decodedToken);
      logger.fatal(newAccount, 'Account exists in the auth provider but not in the database is just been created');
      throw new NotFoundError(`Account Not found`);
    }

    if (account.users.length === 0 && account.role === AccountRole.USER) {
      throw new NotFoundError({
        message: `Account Not found`,
        internalLog: 'Account exists but send 404 since it has no users',
      });
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
      const newAccount = await this.accountService.createEmergencyAccount(decodedToken);
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
