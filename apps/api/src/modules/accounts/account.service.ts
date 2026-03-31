import { firebaseAuthService } from '@/firebase/service/firebase.auth.service';
import { AccountRepo } from './account.repo';
import { InternalServerError } from '@/err/customErrors';

export class AccountService {
  constructor(private readonly accountRepo: AccountRepo) {}

  async authenticateWithPassword(tokenId: string) {
    const decodedToken = await firebaseAuthService.verifyToken(tokenId);

    const userAuthId = decodedToken.uid;

    const user = await this.accountRepo.getAccountByAuthId({
      authId: userAuthId,
      include: { avatar: true, users: { include: { roles: true, parent: true, school: true } } },
    });

    if (!user) {
      throw new InternalServerError(`User with authId ${userAuthId} does not exist in the system.`);
    }
    user.users[0].sch;

    return UserMapper.toUserProfileResponse(user, decodedToken.picture || null);
  }
}
