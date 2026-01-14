import { PresignedUrlGenerator } from '@contracts/storage/PresignedUrl';
import { IStorageProvider } from '../interface/storage.interface';
import { S3Client } from '@aws-sdk/client-s3';

export class AwsStorageService implements IStorageProvider {
  client: S3Client = new S3Client({ region: 'us-east-1' });
  async generatePresignedUrl({ mediaKey: fileKey, mimeType, expiresIn }: PresignedUrlGenerator): Promise<string> {
    // Implementation for production S3 storage
    // This is a placeholder; actual implementation would go here
    throw new Error('S3StorageProvider.generatePresignedUrl not implemented.');
  }

  getObjectUrl(fileKey: string): string {
    throw new Error('S3StorageProvider.getObjectUrl not implemented.');
  }
}
