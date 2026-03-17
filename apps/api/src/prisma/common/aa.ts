import { prisma } from '@/bootstrap/db.init';

const generateCommons = () => {
  prisma.product.deleteMany({ where: { id: 'dsd' } });
};
