// src/middleware/rate-limit.middleware.ts

import rateLimit from 'express-rate-limit';

const isDev = process.env.NODE_ENV === 'development';

// General API rate limit
export const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: isDev ? 10000 : parseInt(process.env.RATE_LIMIT_MAX || '100'),
  message: {
    success: false,
    message: 'Too many requests, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isDev, // skip entirely in dev
});

// Stricter limit for auth endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDev ? 1000 : 10,
  message: {
    success: false,
    message: 'Too many login attempts, please try again later',
  },
  skipSuccessfulRequests: true,
  skip: () => isDev, // skip entirely in dev
});

// Upload rate limit
export const uploadLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: isDev ? 1000 : 10,
  message: {
    success: false,
    message: 'Upload limit exceeded',
  },
  skip: () => isDev,
});
