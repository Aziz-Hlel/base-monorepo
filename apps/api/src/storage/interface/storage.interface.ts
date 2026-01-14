import { S3Client } from '@aws-sdk/client-s3';
import { PresignedUrlGenerator } from '@contracts/storage/PresignedUrl';

export interface IStorageProvider {
  client: S3Client;

  generatePresignedUrl(params: PresignedUrlGenerator): Promise<string>;

  getObjectUrl(fileKey: string): string;
}
