import ENV from '@/config/ENV';
import { IStorageProvider } from '../interface/storage.interface';
import { MinioService } from './minio.service';
import { AwsStorageService } from './awsStorage.service';

export function createStorageProvider(): IStorageProvider {
  switch (ENV.NODE_ENV) {
    case 'dev':
    case 'test':
      return new MinioService({
        MINIO_Region: ENV.MINIO_REGION,
        MINIO_PORT: ENV.MINIO_PORT,
        MINIO_ROOT_USER: ENV.MINIO_ROOT_USER,
        MINIO_ROOT_PASSWORD: ENV.MINIO_ROOT_PASSWORD,
        MINIO_BUCKET: ENV.MINIO_BUCKET,
      });

    case 'production':
    case 'stage':
      return new AwsStorageService();
  }
}

export const StorageProvider: IStorageProvider = createStorageProvider();
