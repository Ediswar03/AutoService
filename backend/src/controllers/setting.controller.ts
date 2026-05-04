// src/controllers/setting.controller.ts

import { Request, Response, NextFunction } from 'express';
import { settingService } from '../services/setting.service';
import { sendSuccess } from '../utils/response.util';

export class SettingController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const settings = await settingService.getAll();
      sendSuccess(res, settings);
    } catch (error) {
      next(error);
    }
  }

  async getByGroup(req: Request, res: Response, next: NextFunction) {
    try {
      const { group } = req.params;
      const settings = await settingService.getGroup(group as string);
      sendSuccess(res, settings);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { key, value, group, description } = req.body;
      const setting = await settingService.update(key, value, group, description);
      sendSuccess(res, setting, 'Setting updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateBulk(req: Request, res: Response, next: NextFunction) {
    try {
      const { settings } = req.body;
      if (!Array.isArray(settings)) {
        return res.status(400).json({ message: 'Settings must be an array' });
      }
      const results = await settingService.updateMany(settings);
      sendSuccess(res, results, 'Settings updated successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const settingController = new SettingController();
