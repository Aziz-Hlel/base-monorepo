import { Account } from '@/generated/prisma/client';
import { AccountEntityRequest } from '@/types/includes/account';
import { Claims } from '@/types/token/Claims';

export class FirebaseMapper {
  static toNewAccountClaims({ account }: { account: Account }): Claims {
    return {
      accountId: account.id,
      accountRole: account.role,
    };
  }

  static toClaims({ account }: { account: AccountEntityRequest }): Claims {
    return {
      accountId: account.id,
      accountRole: account.role,
    };
  }
}
