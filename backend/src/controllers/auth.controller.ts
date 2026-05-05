// src/controllers/auth.controller.ts

import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import {
  loginSchema,
  registerSchema,
  changePasswordSchema,
  refreshTokenSchema,
  updateProfileSchema,
} from '../schemas/auth.schema';
import { sendSuccess, sendCreated } from '../utils/response.util';

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const data = registerSchema.parse(req.body);
      const user = await authService.register(data);
      sendCreated(res, user, 'User registered successfully');
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const data = loginSchema.parse(req.body);
      const result = await authService.login(data);
      sendSuccess(res, result, 'Login successful');
    } catch (error) {
      next(error);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = refreshTokenSchema.parse(req.body);
      const tokens = await authService.refreshToken(refreshToken);
      sendSuccess(res, tokens, 'Token refreshed');
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.body?.refreshToken;
      await authService.logout(req.user!.userId, refreshToken);
      sendSuccess(res, null, 'Logged out successfully');
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await authService.getProfile(req.user!.userId);
      sendSuccess(res, user);
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const data = changePasswordSchema.parse(req.body);
      await authService.changePassword(
        req.user!.userId,
        data.currentPassword,
        data.newPassword
      );
      sendSuccess(res, null, 'Password changed successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, phone, address, theme } = updateProfileSchema.parse(req.body);
      let photoUrl: string | undefined;

      // If photo file was uploaded, save it
      if (req.file) {
        const { uploadService } = await import('../services/upload.service');
        const fileKey = await uploadService.uploadImage(req.file, 'avatars');
        photoUrl = fileKey;
      }

      const updated = await authService.updateProfile(req.user!.userId, {
        name,
        phone,
        address,
        theme,
        ...(photoUrl !== undefined && { photoUrl }),
      });

      sendSuccess(res, updated, 'Profile updated successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
