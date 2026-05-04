// src/controllers/ai.controller.ts

import { Request, Response, NextFunction } from 'express';
import { aiService } from '../services/ai.service';
import { sendSuccess } from '../utils/response.util';

export class AIController {
  async chat(req: Request, res: Response, next: NextFunction) {
    try {
      const { message } = req.body;
      const userId = req.user?.userId;

      if (!message) {
        return res.status(400).json({ message: 'Message is required' });
      }

      const response = await aiService.chat(message, userId as string);
      sendSuccess(res, { response });
    } catch (error) {
      next(error);
    }
  }
}

export const aiController = new AIController();
