import type { SubjectEnum } from '../../types/enums/enums';

export type TeacherResponse = {
  id: string;
  firstName: string;
  lastName: string;
  publicId: string;
  isTeacher: boolean;
  subject: SubjectEnum | null;
  schoolId: string;
  createdAt: string;
  updatedAt: string;
};
