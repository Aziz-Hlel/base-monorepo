import { AccountRole } from '@/generated/prisma/enums';
import { AccountSeed } from '../fakes/account.seed';
import { OwnerSeed } from '../fakes/owner.seed';
import { SchoolSeed } from '../fakes/school.seed';
import { UserSeed } from '../fakes/users.fake';
import ISeed from '../ISeed';
import { data } from './data';

export class SeedDevService implements ISeed {
  constructor(
    private readonly accountSeed: AccountSeed,
    private readonly ownerSeed: OwnerSeed,
    private readonly schoolSeed: SchoolSeed,
    private readonly userSeed: UserSeed,
  ) {}

  generateFakeAccountWithRoleUser = (index: number) => {
    return {
      email: `user${index}@gmail.com`,
      password: '12345678',
      displayName: `user${index}`,
      role: AccountRole.USER,
    };
  };

  run = async () => {
    data.forEach(async (tenant) => {
      const { account } = await this.accountSeed.run({ email: tenant.account.email, accountRole: AccountRole.ADMIN });
      const { owner } = await this.ownerSeed.run({ accountId: account.id });
      const school = await this.schoolSeed.run({ ownerId: owner.id });

      tenant.users.simpleUsers.forEach(async (accountInfo) => {
        const { account } = await this.accountSeed.run({
          email: accountInfo.email,
          accountRole: AccountRole.USER,
        });

        const user = await this.userSeed.run({
          accountId: account.id,
          schoolId: school.id,
        });
      });
    });
  };
}
