import request from 'supertest';
import app from '../app';
import { prismaMock } from './singleton';
import * as jwt from 'jsonwebtoken';

const generateToken = (role = 'ADMIN') => {
  const payload = { userId: '1', email: 'admin@test.com', role };
  return jwt.sign(payload, process.env.JWT_SECRET || 'secret123', { expiresIn: '15m' });
};

describe('Work Order API', () => {
  const token = generateToken();

  describe('GET /api/v1/work-orders', () => {
    it('should return paginated list of work orders', async () => {
      const mockWorkOrders = [
        {
          id: '1',
          woNumber: 'WO-20231010-0001',
          customerId: 'c1',
          vehicleId: 'v1',
          status: 'PENDING',
          mileage: 50000,
          customerComplaints: 'Engine noise',
          mechanicNotes: null,
          totalServices: 0,
          totalSpareparts: 0,
          subtotal: 0,
          tax: 0,
          discount: 0,
          grandTotal: 0,
          receivedAt: new Date(),
          startedAt: null,
          completedAt: null,
          assignedMechanicId: null,
          creatorId: 'u1',
          createdAt: new Date(),
          updatedAt: new Date(),
          customer: { name: 'Customer 1' },
          vehicle: { licensePlate: 'B 1234 CD', brand: 'Toyota' },
        },
      ];

      prismaMock.workOrder.findMany.mockResolvedValue(mockWorkOrders as any);
      prismaMock.workOrder.count.mockResolvedValue(1);

      const response = await request(app)
        .get('/api/v1/work-orders')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.data.length).toBe(1);
    });
  });

  describe('POST /api/v1/work-orders', () => {
    it('should create a new work order', async () => {
      // Mock the count for WO generation
      prismaMock.workOrder.count.mockResolvedValue(0);

      const newWO = {
        id: '1',
        woNumber: 'WO-1234-0001',
        customerId: 'c1',
        vehicleId: 'v1',
        status: 'PENDING',
        mileage: 10000,
        customerComplaints: 'Oil change',
        totalServices: 0,
        totalSpareparts: 0,
        subtotal: 0,
        tax: 0,
        discount: 0,
        grandTotal: 0,
        receivedAt: new Date(),
        creatorId: 'u1',
        createdAt: new Date(),
        updatedAt: new Date(),
        services: [],
        spareparts: [],
      };

      prismaMock.workOrder.create.mockResolvedValue(newWO as any);
      prismaMock.workOrder.findUnique.mockResolvedValue(newWO as any);

      // Audit log mock
      prismaMock.auditLog.create.mockResolvedValue({} as any);

      const response = await request(app)
        .post('/api/v1/work-orders')
        .set('Authorization', `Bearer ${token}`)
        .send({
          customerId: '123e4567-e89b-12d3-a456-426614174000',
          vehicleId: '123e4567-e89b-12d3-a456-426614174001',
          mileage: 10000,
          customerComplaints: 'Oil change',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.woNumber).toBe('WO-1234-0001');
    });
  });

  describe('PUT /api/v1/work-orders/:id/status', () => {
    it('should update the status of a work order', async () => {
      const mockWO = {
        id: '1',
        status: 'IN_PROGRESS',
        updatedAt: new Date(),
      };

      // Mock finding the work order
      prismaMock.workOrder.findUnique.mockResolvedValue({ id: '1', status: 'PENDING' } as any);
      
      // Mock the update
      prismaMock.workOrder.update.mockResolvedValue(mockWO as any);
      prismaMock.auditLog.create.mockResolvedValue({} as any);

      const response = await request(app)
        .put('/api/v1/work-orders/1/status')
        .set('Authorization', `Bearer ${token}`)
        .send({
          status: 'IN_PROGRESS',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('IN_PROGRESS');
    });
  });
});
