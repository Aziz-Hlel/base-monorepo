import { MediaResponse } from '../media/MediaResponse';

export type ProductResponse = {
  id: string;
  name: string;
  description: string;
  price: number;
  thumbnail: MediaResponse | null;
  createdAt: string;
  updatedAt: string;
};
