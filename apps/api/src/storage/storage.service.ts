import { PresignedUrlGenerator } from '@contracts/storage/PresignedUrl';
import { IStorageProvider } from './interface/storage.interface';
import { createStorageProvider } from './provider/storage.provider';
import path from 'path';
import { EntityType } from '@contracts/schemas/media/EntityType';
import { HeadBucketCommand } from '@aws-sdk/client-s3';
import ENV from '@/config/ENV';
import { logger } from '@/bootstrap/logger.init';

export class StorageService implements IStorageProvider {
  private storageProvider = createStorageProvider();
  client = this.storageProvider.client;

  async generatePresignedUrl(params: PresignedUrlGenerator): Promise<string> {
    return this.storageProvider.generatePresignedUrl(params);
  }
  getObjectUrl(fileKey: string): string {
    return this.storageProvider.getObjectUrl(fileKey);
  }

  generateMediaKey(mediaName: string): string {
    const ext = path.extname(mediaName);
    const baseName = path.basename(mediaName, ext);
    const safeBase = baseName.replace(/[^a-zA-Z0-9-_]/g, '').slice(0, 50);
    const timestamp = Date.now();
    return `${safeBase}-${timestamp}${ext}`;
  }

  async verifyConnection() {
    const Bucket = ENV.NODE_ENV === 'dev' ? ENV.MINIO_BUCKET : 'ENV.AWS_S3_BUCKET'; // * Adjust as needed
    try {
      await this.client.send(new HeadBucketCommand({ Bucket }));
      logger.info('✅ SUCCESS : Storage Provider connection successful.');
    } catch (error) {
      logger.error(error, '❌ ERROR : Storage Provider connection failed.');
      throw error;
    }
  }
}

export const storageService = new StorageService();
