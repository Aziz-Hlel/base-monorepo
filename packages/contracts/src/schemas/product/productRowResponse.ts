import { ProductStatus } from '../../types/enums/enums';
import { MediaResponse } from '../media/MediaResponse';

export type ProductRowResponse = {
  id: string;
  name: string;
  description: string;
  price: number;
  thumbnail: MediaResponse | null;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
};
