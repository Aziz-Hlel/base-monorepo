import type { Request, Response } from 'express';
import type { HealthzResponseDto } from '../schemas/healthzResponse.dto';
import type { SimpleApiResponse } from '../../types/api/SimpleApiResponse.dto';

class RootController {
  async getHealth(_: Request, res: Response<SimpleApiResponse>) {
    res.json({ message: 'i feel good !' });
  }

  async getHealthz(_: Request, res: Response<HealthzResponseDto>) {
    res.json({
      success: true,
      message: 'i feel good !',
      timestamp: new Date(),
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
    });
  }
}

export const rootController = new RootController();
