import { MajorSeedService } from '../fakes/major.seed.service';
import { ExamSeedService } from '../fakes/exam.seed.service';
import { seedData } from './data';

export class SeedDevService {
  constructor(
    private readonly majorSeedService: MajorSeedService,
    private readonly examSeedService: ExamSeedService,
  ) {}

  run = async () => {
    seedData.majors.forEach(async (majorData) => {
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

    const electiveExamQueries = seedData.electiveExams.map(async (electiveExamData) => {
      await this.examSeedService.run({
        data: electiveExamData,
      });
    });
    await Promise.all(electiveExamQueries);

    console.log('✅ SUCCESS : Seeding completed.');
  };
}
