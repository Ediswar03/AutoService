import request from 'supertest';
import app from '../app';
import { prismaMock } from './singleton';
import * as jwt from 'jsonwebtoken';

const generateToken = (role = 'ADMIN') => {
  const payload = { userId: '1', email: 'admin@test.com', role };
  return jwt.sign(payload, process.env.JWT_SECRET || 'secret123', { expiresIn: '15m' });
};

describe('Vehicle API', () => {
  const token = generateToken();

  describe('GET /api/v1/vehicles', () => {
    it('should return paginated list of vehicles', async () => {
      const mockVehicles = [
        {
          id: '1',
          customerId: 'c1',
          licensePlate: 'B 1234 CD',
          brand: 'Toyota',
          model: 'Avanza',
          year: 2020,
          color: 'Black',
          chassisNumber: null,
          engineNumber: null,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          customer: { id: 'c1', name: 'Test Customer', phone: '123456' },
        },
      ];

      prismaMock.vehicle.findMany.mockResolvedValue(mockVehicles as any);
      prismaMock.vehicle.count.mockResolvedValue(1);

      const response = await request(app)
        .get('/api/v1/vehicles')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.data.length).toBe(1);
      expect(response.body.data.pagination.total).toBe(1);
    });
  });

  describe('POST /api/v1/vehicles', () => {
    it('should create a new vehicle', async () => {
      const newVehicle = {
        id: '1',
        customerId: 'c1',
        licensePlate: 'B 4321 DC',
        brand: 'Honda',
        model: 'Civic',
        year: 2022,
        color: 'White',
        chassisNumber: null,
        engineNumber: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        customer: { id: 'c1', name: 'Test Customer' },
      };

      prismaMock.vehicle.create.mockResolvedValue(newVehicle as any);

      const response = await request(app)
        .post('/api/v1/vehicles')
        .set('Authorization', `Bearer ${token}`)
        .send({
          customerId: '123e4567-e89b-12d3-a456-426614174000',
          licensePlate: 'B 4321 DC',
          brand: 'Honda',
          model: 'Civic',
          year: 2022,
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.brand).toBe('Honda');
    });
  });
});
