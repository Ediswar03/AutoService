// src/config/s3.config.ts

import * as Minio from 'minio';

export const s3Config = {
  endPoint: process.env.S3_ENDPOINT || 'localhost',
  port: parseInt(process.env.S3_PORT || '9000'),
  useSSL: process.env.S3_USE_SSL === 'true',
  accessKey: process.env.S3_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.S3_SECRET_KEY || 'minioadmin',
};

export const S3_BUCKET = process.env.S3_BUCKET || 'autoservis';

let minioClient: Minio.Client | null = null;

export function getMinioClient(): Minio.Client {
  if (!minioClient) {
    minioClient = new Minio.Client(s3Config);
  }
  return minioClient;
}

export async function ensureBucket(): Promise<void> {
  const client = getMinioClient();
  const exists = await client.bucketExists(S3_BUCKET);
  if (!exists) {
    await client.makeBucket(S3_BUCKET);
    console.log(`✅ S3 bucket "${S3_BUCKET}" created`);
    
    // Set bucket policy to public read
    const policy = {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: { AWS: ['*'] },
          Action: ['s3:GetObject'],
          Resource: [`arn:aws:s3:::${S3_BUCKET}/*`],
        },
      ],
    };
    await client.setBucketPolicy(S3_BUCKET, JSON.stringify(policy));
    console.log(`✅ S3 bucket "${S3_BUCKET}" policy set to public read`);
  }
}

export default getMinioClient;
