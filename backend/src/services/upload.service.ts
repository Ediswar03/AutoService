import { getMinioClient, S3_BUCKET } from '../config/s3.config';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';

export class UploadService {
  private localUploadDir = path.join(process.cwd(), 'uploads');
  private isMinioAvailable = true;

  constructor() {
    if (!fs.existsSync(this.localUploadDir)) {
      fs.mkdirSync(this.localUploadDir, { recursive: true });
    }
  }

  async uploadImage(file: Express.Multer.File, folder: string = 'images'): Promise<string> {
    const fileExtension = path.extname(file.originalname);
    const fileName = `${folder}/${crypto.randomUUID()}${fileExtension}`;
    
    try {
      if (!this.isMinioAvailable) throw new Error('MinIO is known to be unavailable. Using local storage.');
      
      const minioClient = getMinioClient();
      await minioClient.putObject(
        S3_BUCKET,
        fileName,
        file.buffer,
        file.size,
        { 'Content-Type': file.mimetype }
      );

      return fileName;
    } catch (error) {
      console.warn('⚠️ MinIO upload failed, falling back to local file storage.', error instanceof Error ? error.message : String(error));
      this.isMinioAvailable = false; // Mark unavailable so we skip minio next time

      // Save locally
      const localFilePath = path.join(this.localUploadDir, fileName);
      const dirName = path.dirname(localFilePath);
      if (!fs.existsSync(dirName)) {
        fs.mkdirSync(dirName, { recursive: true });
      }
      fs.writeFileSync(localFilePath, file.buffer);

      // Prefix with "local:" to distinguish when retrieving
      return `local:${fileName}`;
    }
  }

  async deleteFile(fileKey: string): Promise<void> {
    if (fileKey.startsWith('local:')) {
      const actualKey = fileKey.replace('local:', '');
      const localFilePath = path.join(this.localUploadDir, actualKey);
      if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
      }
      return;
    }

    try {
      const minioClient = getMinioClient();
      await minioClient.removeObject(S3_BUCKET, fileKey);
    } catch (error) {
      console.error('Failed to delete from Minio', error);
    }
  }

  async getPresignedUrl(fileKey: string): Promise<string> {
    if (fileKey.startsWith('local:')) {
      const actualKey = fileKey.replace('local:', '');
      return `/api/v1/uploads/${actualKey}`;
    }

    try {
      const minioClient = getMinioClient();
      return await minioClient.presignedGetObject(S3_BUCKET, fileKey, 24 * 60 * 60);
    } catch (error) {
      console.warn('⚠️ Failed to get presigned URL from MinIO, attempting local fallback if file exists...', error instanceof Error ? error.message : String(error));
      return `/api/v1/uploads/${fileKey}`; // Fallback assuming it might be local
    }
  }
}

export const uploadService = new UploadService();
