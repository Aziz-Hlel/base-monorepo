import { SubjectEnum } from '../enums';

// ! started working on it then abandoned the idea idk if i really need it, or the moment the only use i see is to chekc the sUPER ADMIN when he insert the timetable for BAC
type SelectiveExamsEnum = {
  [key in SubjectEnum]: key;
};

export const selectiveExamsEnum = {
  MANDARIN: SubjectEnum.MANDARIN,
  SPANISH: SubjectEnum.SPANISH,
  ITALIAN: SubjectEnum.ITALIAN,
  GERMAN: SubjectEnum.GERMAN,
  HISTORY: SubjectEnum.HISTORY,
  GEOGRAPHY: SubjectEnum.GEOGRAPHY,
  MUSIC: SubjectEnum.MUSIC,
} as const satisfies Partial<SelectiveExamsEnum>;

export type ElectiveExamEnum_V2 = keyof typeof selectiveExamsEnum;
