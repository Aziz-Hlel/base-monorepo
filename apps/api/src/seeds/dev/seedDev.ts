import { firebaseAuthService } from '@/firebase/service/firebase.auth.service';
import seedAccount from '../fakes/accounts.seed';
import seedOwner from '../fakes/owners.seed';
import seedSchool from '../fakes/school.fake';
import { data } from './data';

const seedDev = async () => {
  data.forEach(async (tenant) => {
    const account = await seedAccount({
      email: tenant.account.email,
      accountRole: tenant.account.role,
    });

    const owner =
      account.owner ?? (await seedOwner({ accountId: account.id, accountRole: account.role, authId: account.authId }));
    const school = owner.school ?? (await seedSchool({ ownerId: owner.id, schoolName: tenant.school.name }));

    await firebaseAuthService.setAccountClaims({
      authId: account.authId,
      claims: {
        id: account.id,
        role: account.role,
      },
    });
  });
};

export default seedDev;
