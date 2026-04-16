import type { ClassGrade } from '../../types/enums/enums';

export type ClassResponse = {
  id: string;
  name: string;
  description: string | null;
  grade: ClassGrade;
  createdAt: string;
  updatedAt: string;
};
