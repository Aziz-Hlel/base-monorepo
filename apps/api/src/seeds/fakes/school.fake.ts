import { prisma } from '@/bootstrap/db.init';
import { SchoolPlan } from '@/generated/prisma/client';
import { faker } from '@faker-js/faker/dist/';
import { generateFakeMediaInstance } from '../helper/generateSeedMedia';

const seedSchool = async ({ ownerId, schoolName }: { ownerId: string; schoolName: string }) => {
  //   account.owner?.school;

  const school = await prisma.school.create({
    data: {
      nameEn: schoolName,
      nameFr: schoolName,
      nameAr: schoolName,
      address: faker.location.streetAddress(),
      phone: faker.phone.number(),
      email: faker.internet.email(),
      plan: faker.helpers.arrayElement(Object.values(SchoolPlan)),
      slug: faker.lorem.slug(),
      logo: {
        create: generateFakeMediaInstance(),
      },
      owner: {
        connect: {
          id: ownerId,
        },
      },
    },
  });

  return school;
};

export default seedSchool;
