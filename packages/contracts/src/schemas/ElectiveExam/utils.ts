import { ElectiveExamEnum } from '../../types/enums/enums';

export const isElectiveExamEnum = (value: string): value is ElectiveExamEnum => {
  return value in ElectiveExamEnum;
};
