export class TeacherSeed {
  constructor(private readonly userRepo: UserRepo) {}

  run = async (params: { schema: CreateUserInput; schoolId: string; accountId: string }, tx?: TX) => {
    const { schema, schoolId, accountId } = params;
    const existingUser = await this.userRepo.findByAccountIdSchoolId({ accountId, schoolId, include: {} });
    if (existingUser) return existingUser;
    const user = await this.userRepo.createUserWithSimpleRole({ schema, schoolId, accountId }, tx);
    return user;
  };
}
