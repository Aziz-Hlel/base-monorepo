import type { SubjectEnum, TermEnum } from '../../types/enums/enums';
import type { MajorResponse } from '../major/majorResponse';

export type ExamWithMajorResponse = {
  id: string;
  subject: SubjectEnum;
  term: TermEnum;
  date: string;
  startTime: string;
  endTime: string;
  isOptional: boolean;
  major: MajorResponse | null;
  createdAt: string;
  updatedAt: string;
};
