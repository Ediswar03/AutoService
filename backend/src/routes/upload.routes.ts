import { Router } from 'express';
import { uploadController } from '../controllers/upload.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import multer from 'multer';

// For multer, we just use memory storage since we handle the buffer in the service.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

const router = Router();

// Endpoint for uploading image
router.post(
  '/',
  authMiddleware,
  upload.single('file'),
  uploadController.uploadImage
);

// Endpoint for deleting image
router.delete(
  '/',
  authMiddleware,
  uploadController.deleteImage
);

export default router;
