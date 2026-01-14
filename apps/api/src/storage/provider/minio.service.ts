import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { IStorageProvider } from '../interface/storage.interface';
import { PresignedUrlGenerator } from '@contracts/storage/PresignedUrl';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export type IMinioConfig = {
  MINIO_Region: string;
  MINIO_PORT: number;
  MINIO_ROOT_USER: string;
  MINIO_ROOT_PASSWORD: string;
  MINIO_BUCKET: string;
};

export class MinioService implements IStorageProvider {
  client: S3Client;
  private MINIO_Region: string;
  private MINIO_PORT: number;
  private MINIO_BUCKET: string;

  constructor({ MINIO_Region, MINIO_PORT, MINIO_ROOT_USER, MINIO_ROOT_PASSWORD, MINIO_BUCKET }: IMinioConfig) {
    this.MINIO_Region = MINIO_Region;
    this.MINIO_PORT = MINIO_PORT;
    this.MINIO_BUCKET = MINIO_BUCKET;

    this.client = new S3Client({
      region: this.MINIO_Region,
      endpoint: `http://localhost:${this.MINIO_PORT}/`,
      credentials: {
        accessKeyId: MINIO_ROOT_USER,
        secretAccessKey: MINIO_ROOT_PASSWORD,
      },
      forcePathStyle: true,
    });
  }

  async generatePresignedUrl({ mediaKey: fileKey, mimeType, expiresIn }: PresignedUrlGenerator): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.MINIO_BUCKET,
      Key: fileKey,
      ContentType: mimeType,
      // ContentDisposition: 'attachment', // Security: prevent content-type switching
    });

    const signedUrl = await getSignedUrl(this.client, command, { expiresIn });

    return signedUrl;
  }

  getObjectUrl(fileKey: string): string {
    const objectUrl = `http://localhost:${this.MINIO_PORT}/${this.MINIO_BUCKET}/${fileKey}`;
    return objectUrl;
  }
}
