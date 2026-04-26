import { Request, Response, NextFunction } from 'express';
import { uploadService } from '../services/upload.service';
import { sendSuccess, sendError } from '../utils/response.util';

export class UploadController {
  async uploadImage(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        return sendError(res, 'No file uploaded', 400);
      }

      const folder = req.body.folder || 'images';
      const fileKey = await uploadService.uploadImage(req.file, folder);
      const url = await uploadService.getPresignedUrl(fileKey);

      sendSuccess(res, {
        fileKey,
        url,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size
      }, 'Image uploaded successfully');
    } catch (error) {
      next(error);
    }
  }

  async deleteImage(req: Request, res: Response, next: NextFunction) {
    try {
      const { fileKey } = req.body;
      if (!fileKey) {
        return sendError(res, 'fileKey is required', 400);
      }

      await uploadService.deleteFile(fileKey);
      sendSuccess(res, null, 'File deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const uploadController = new UploadController();
