import { PresignedUrlGenerator } from '@contracts/storage/PresignedUrl';
import { IStorageProvider } from '../interface/storage.interface';

export class AwsStorageService implements IStorageProvider {
  async generatePresignedUrl({ mediaKey: fileKey, mimeType, expiresIn }: PresignedUrlGenerator): Promise<string> {
    // Implementation for production S3 storage
    // This is a placeholder; actual implementation would go here
    throw new Error('S3StorageProvider.generatePresignedUrl not implemented.');
  }

  getObjectUrl(fileKey: string): string {
    throw new Error('S3StorageProvider.getObjectUrl not implemented.');
  }
}
