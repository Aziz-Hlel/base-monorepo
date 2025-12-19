import { prisma } from '../../bootstrap/db.init';

export class UserRepo {
  async isUserExists(id: string): Promise<boolean> {
    const user = await prisma.user.findUnique({ where: { id } });
    return !!user;
  }

  async isUserAuthIdExists(authId: string): Promise<boolean> {
    const user = await prisma.user.findUnique({ where: { authId } });
    return !!user;
  }

  async isUserEmailExists(email: string): Promise<boolean> {
    const user = await prisma.user.findUnique({ where: { email } });
    return !!user;
  }

  async getUserByAuthId(authId: string) {
    return await prisma.user.findUnique({ where: { authId } });
  }
  async getUserByEmail(email: string) {
    return await prisma.user.findUnique({ where: { email } });
  }

  async getUserById(id: string) {
    return await prisma.user.findUnique({ where: { id } });
  }
}

export const userRespo = new UserRepo();
