import { presignedUrlRequestSchema } from '@contracts/schemas/media/PresignedUrlRequest';
import { mediaService } from './media.service';
import { Request, Response } from 'express';
import { PresignedUrlResponse } from '@contracts/schemas/media/PresignedUrlResponse';

class MediaController {
  async getPresignedUrl(req: Request, res: Response<PresignedUrlResponse>) {
    const schema = presignedUrlRequestSchema.parse(req.body);
    const presignedUrlResponse = await mediaService.getPresignedUrl(schema);
    res.json(presignedUrlResponse);
  }
}

export const mediaController = new MediaController();
