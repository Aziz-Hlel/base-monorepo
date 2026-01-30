import { storageService } from '@/storage/storage.service';
import { PresignedUrlRequest } from '@contracts/schemas/media/PresignedUrlRequest';
import { mediaRepo } from './media.repo';
import { NotFoundError } from '@/err/customErrors';
import { MediaStatus } from '@/generated/prisma/enums';
import { PresignedUrlResponse } from '@contracts/schemas/media/PresignedUrlResponse';
import { Media } from '@/generated/prisma/client';
import { MediaResponse } from '@contracts/schemas/media/MediaResponse';

export class MediaService {
  async getPresignedUrl(schema: PresignedUrlRequest): Promise<PresignedUrlResponse> {
    const mediaKey = storageService.generateMediaKey(schema.name);
    const { mimeType } = schema;
    const expiresIn = 3600;

    const createdMedia = await mediaRepo.createPendingMedia(schema, mediaKey);

    const signedUrl = await storageService.generatePresignedUrl({
      mediaKey,
      mimeType,
      expiresIn,
    });

    return {
      id: createdMedia.id,
      url: signedUrl,
      key: mediaKey,
    };
  }

  async deleteMediaById(mediaId: string) {
    const media = await mediaRepo.findMediaById(mediaId);
    if (!media) throw new NotFoundError(`Media with id ${mediaId} not found`);

    await mediaRepo.deleteMediaById(mediaId);
  }

  async confirmMediaUploadByKey(mediaKey: string) {
    const media = await mediaRepo.findMediaByKey(mediaKey);

    if (!media) throw new NotFoundError(`Media with key ${mediaKey} not found`);

    if (media.status !== MediaStatus.PENDING)
      throw new Error(`try to CONFIRM Media with key ${mediaKey} which is not in PENDING status`);

    await mediaRepo.confirmMediaUploadByKey(mediaKey);
  }

  async confirmMediaUploadById(mediaId: string) {
    const media = await mediaRepo.findMediaById(mediaId);

    if (!media) throw new NotFoundError(`Media with id ${mediaId} not found`);

    if (media.status !== MediaStatus.PENDING)
      throw new Error(`try to CONFIRM Media with id ${mediaId} which is not in PENDING status`);

    await mediaRepo.confirmMediaUploadById(mediaId); // ! ouslt houni
  }

  async switchMediaIds({ oldMediaKey, newMediaKey }: { oldMediaKey: string | null; newMediaKey: string }) {
    return await mediaRepo.switchMediaIds({
      oldMediaId: oldMediaKey,
      newMediaId: newMediaKey,
    });
  }

  getMediaKeyAndUrl(media: Media | null): MediaResponse | null {
    if (!media) return null;
    const url = storageService.getObjectUrl(media.key);

    return {
      id: media.id,
      key: media.key,
      url,
    };
  }
}

export const mediaService = new MediaService();
