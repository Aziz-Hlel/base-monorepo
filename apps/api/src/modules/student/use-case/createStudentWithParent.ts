import { StudentRepo } from '../student.repo';
import { StudentParentRepo } from '../studentParent.repo';

export class CreateStudentWithParentUseCase {
  constructor(
    private readonly studentRepo: StudentRepo,
    private readonly studentParentRepo: StudentParentRepo,
  ) {}

  execute = async (params: { input: CreateStudentRequest; studentId: string; schoolId: string }, tx?: TX) => {
    const { input, studentId, schoolId } = params;
    try {
      const createdStudent = await this.studentRepo.create({ input, studentId, schoolId }, tx);
      const studentResponse = StudentMapper.toResponse(createdStudent);
      return studentResponse;
    } catch (error) {
      if (error instanceof RepoKnownErrors.ConflictError) {
        throw new ConflictError({ message: 'Student already exists', cause: error });
      }
      if (error instanceof RepoKnownErrors.NotFoundError) {
        throw new NotFoundError({
          message: 'Failed to create student',
          cause: error,
          internalLog: `Where student id = ${studentId} and school id = ${schoolId} is not found`,
        });
      }
      throw error;
    }
  };
}
