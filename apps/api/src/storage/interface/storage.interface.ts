import { PresignedUrlGenerator } from '@contracts/storage/PresignedUrl';

export interface IStorageProvider {
  generatePresignedUrl(params: PresignedUrlGenerator): Promise<string>;

  getObjectUrl(fileKey: string): string;
}
