import type { CityEnum } from '../../types/enums/enums';

export type SchoolResponse = {
  id: string;
  name: string;
  publicId: string;
  city: CityEnum;
};
