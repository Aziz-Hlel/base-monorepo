import { Request, Response } from 'express';
import { HealthzResponseDto } from '../schemas/healthzResponse.dto';
import { SimpleApiResponse } from '../../types/api/SimpleApiResponse.dto';
import { prisma } from '../../bootstrap/db.init';

class RootController {
  async getHealth(req: Request, res: Response<SimpleApiResponse>) {
    res.json({ message: 'i feel good !' });
  }

  async getHealthz(req: Request, res: Response<HealthzResponseDto>) {
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
