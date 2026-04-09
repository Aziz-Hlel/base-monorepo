import { MajorEnum } from '../../types/enums/enums';

const majorEnumNames = Object.values(MajorEnum);

export const isMajorEnum = (name: string): name is MajorEnum => majorEnumNames.includes(name as MajorEnum);
