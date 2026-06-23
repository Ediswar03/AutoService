import request from 'supertest';
import app from '../app';
import { prismaMock } from './singleton';
import { hashPassword } from '../utils/password.util';
import * as jwt from 'jsonwebtoken';

describe('Auth API', () => {
  describe('POST /api/v1/auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      const hashedPassword = await hashPassword('password123');
      
      const user = {
        id: '1',
        email: 'test@example.com',
        password: hashedPassword,
        name: 'Test User',
        phone: '1234567890',
        address: 'Test Address',
        role: 'ADMIN',
        photoUrl: null,
        theme: 'light',
        isActive: true,
        lastLoginAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.user.findUnique.mockResolvedValue(user as any);
      prismaMock.refreshToken.create.mockResolvedValue({
        id: '1',
        userId: user.id,
        token: 'refresh-token',
        expiresAt: new Date(Date.now() + 86400 * 1000),
        createdAt: new Date(),
      });
      prismaMock.user.update.mockResolvedValue(user as any);
      prismaMock.auditLog.create.mockResolvedValue({} as any);

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.refreshToken).toBeDefined();
      expect(response.body.data.user.email).toBe('test@example.com');
    });

    it('should fail with invalid credentials', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid email or password');
    });
  });

  describe('GET /api/v1/auth/me', () => {
    it('should return user profile if authenticated', async () => {
      const user = {
        id: '1',
        email: 'test@example.com',
        password: 'hashed-password',
        name: 'Test User',
        phone: '1234567890',
        address: 'Test Address',
        role: 'ADMIN',
        photoUrl: null,
        theme: 'light',
        isActive: true,
        lastLoginAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.user.findUnique.mockResolvedValue(user as any);

      // Generate a real token using the app's secret
      const payload = { userId: user.id, email: user.email, role: user.role };
      const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret123', { expiresIn: '15m' });

      const response = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe('test@example.com');
    });
  });
});
