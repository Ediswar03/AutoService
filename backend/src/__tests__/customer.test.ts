import request from 'supertest';
import app from '../app';
import { prismaMock } from './singleton';
import * as jwt from 'jsonwebtoken';

const generateToken = (role = 'ADMIN') => {
  const payload = { userId: '1', email: 'admin@test.com', role };
  return jwt.sign(payload, process.env.JWT_SECRET || 'secret123', { expiresIn: '15m' });
};

describe('Customer API', () => {
  const token = generateToken();

  describe('GET /api/v1/customers', () => {
    it('should return paginated list of customers', async () => {
      const mockCustomers = [
        {
          id: '1',
          name: 'Customer 1',
          phone: '123456',
          email: 'c1@test.com',
          address: 'Address 1',
          customerType: 'INDIVIDUAL',
          companyName: null,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          vehicles: [],
          _count: { vehicles: 0, workOrders: 0 },
        },
      ];

      prismaMock.customer.findMany.mockResolvedValue(mockCustomers as any);
      prismaMock.customer.count.mockResolvedValue(1);

      const response = await request(app)
        .get('/api/v1/customers')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.data.length).toBe(1);
      expect(response.body.data.pagination.total).toBe(1);
    });
  });

  describe('POST /api/v1/customers', () => {
    it('should create a new customer', async () => {
      const newCustomer = {
        id: '1',
        name: 'New Customer',
        phone: '123456789',
        email: 'new@test.com',
        customerType: 'INDIVIDUAL',
        address: 'Test Addr',
        companyName: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.customer.create.mockResolvedValue(newCustomer as any);

      const response = await request(app)
        .post('/api/v1/customers')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'New Customer',
          phone: '123456789',
          email: 'new@test.com',
          customerType: 'PRIBADI',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('New Customer');
    });
  });

  describe('GET /api/v1/customers/:id', () => {
    it('should return a single customer', async () => {
      const mockCustomer = {
        id: '1',
        name: 'Customer 1',
        phone: '123456',
        email: 'c1@test.com',
        address: 'Address 1',
        customerType: 'INDIVIDUAL',
        companyName: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        vehicles: [],
        _count: { workOrders: 0, invoices: 0 },
      };

      prismaMock.customer.findUnique.mockResolvedValue(mockCustomer as any);

      const response = await request(app)
        .get('/api/v1/customers/1')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Customer 1');
    });

    it('should return 404 if customer not found', async () => {
      prismaMock.customer.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .get('/api/v1/customers/999')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });
});
