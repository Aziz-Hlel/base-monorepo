import type { SubjectEnum, TermEnum } from '../../types/enums/enums';

export type ExamResponse = {
  id: string;
  subject: SubjectEnum;
  term: TermEnum;
  date: string;
  startTime: string;
  endTime: string;
  isOptional: boolean;
  createdAt: string;
  updatedAt: string;
};
