import { MajorSeedService } from '../fakes/major.seed.service';
import { ExamSeedService } from '../fakes/exam.seed.service';
import { examData } from './examData';
import { UserSeedService } from '../fakes/user.seed.service';
import { superAdminData } from './userData';
import { firebaseUserService } from '@/firebase/service/firebase.user.service';

export class SeedDevService {
  constructor(
    private readonly majorSeedService: MajorSeedService,
    private readonly examSeedService: ExamSeedService,
    private readonly userSeedService: UserSeedService,
  ) {}

  run = async () => {
    await Promise.all(
      superAdminData.map(async (adminData) => {
        const userRecord = await firebaseUserService.findOrCreateAccount(adminData);
        await this.userSeedService.run({
          authId: userRecord.uid,
          provider: 'SEED',
          role: adminData.role,
          email: adminData.email,
          isEmailVerified: true,
        });
      }),
    );

    examData.majors.forEach(async (majorData) => {
      const majorResult = await this.majorSeedService.run({ majorName: majorData.name });
      const examsQueries = majorData.exams.map(async (examData) => {
        await this.examSeedService.run({
          data: {
            ...examData,
            majorId: majorResult.major.id,
          },
        });
      });
      await Promise.all(examsQueries);
    });

    const electiveExamQueries = examData.electiveExams.map(async (electiveExamData) => {
      await this.examSeedService.run({
        data: electiveExamData,
      });
    });
    await Promise.all(electiveExamQueries);

    console.log('✅ SUCCESS : Seeding completed.');
  };
}
