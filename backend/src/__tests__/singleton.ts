import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';

const prismaMockObj = mockDeep<PrismaClient>();

jest.mock('../config/database.config', () => ({
  __esModule: true,
  default: prismaMockObj,
  prisma: prismaMockObj,
}));

export const prismaMock = prismaMockObj as unknown as DeepMockProxy<PrismaClient>;

beforeEach(() => {
  mockReset(prismaMock);
  prismaMock.user.findUnique.mockResolvedValue({ id: '1', isActive: true, role: 'ADMIN' } as any);
  
  // Mock $transaction to execute the callback with prismaMock
  prismaMock.$transaction.mockImplementation(async (callback: any) => {
    if (typeof callback === 'function') {
      return callback(prismaMock);
    }
    return Promise.all(callback);
  });
});
