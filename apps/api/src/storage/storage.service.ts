import { PresignedUrlGenerator } from '@contracts/storage/PresignedUrl';
import { IStorageProvider } from './interface/storage.interface';
import { createStorageProvider } from './provider/storage.provider';
import path from 'path';
import { EntityType } from '@contracts/schemas/media/EntityType';

export class StorageService implements IStorageProvider {
  private storageProvider = createStorageProvider();

  async generatePresignedUrl(params: PresignedUrlGenerator): Promise<string> {
    return this.storageProvider.generatePresignedUrl(params);
  }
  getObjectUrl(fileKey: string): string {
    return this.storageProvider.getObjectUrl(fileKey);
  }

  generateMediaKey(mediaName: string, entityType: EntityType): string {
    const ext = path.extname(mediaName);
    const baseName = path.basename(mediaName, ext);
    const safeBase = baseName.replace(/[^a-zA-Z0-9-_]/g, '').slice(0, 50);
    const timestamp = Date.now();
    return `${entityType}/${safeBase}-${timestamp}${ext}`;
  }
}

export const storageService = new StorageService();
