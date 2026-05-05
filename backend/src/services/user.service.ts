// src/services/user.service.ts

import { prisma } from '../config/database.config';
import { parsePagination, createPaginationMeta } from '../utils/pagination.util';
import { PaginationQuery } from '../types/common.types';
import { hashPassword } from '../utils/password.util';
import { AppError } from '../middleware/error.middleware';

export class UserService {
  async findAll(query: PaginationQuery & { role?: string }) {
    const { page, limit, skip, sortBy, sortOrder } = parsePagination(query);

    const where: any = {};
    if (query.role) {
      where.role = query.role;
    }
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          address: true,
          role: true,
          photoUrl: true,
          isActive: true,
          createdAt: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    return {
      data,
      pagination: createPaginationMeta(total, page, limit),
    };
  }

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        address: true,
        role: true,
        photoUrl: true,
        isActive: true,
        createdAt: true,
      },
    });
  }

  async create(data: any) {
    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      throw new AppError('Email already registered', 409);
    }

    const hashedPassword = await hashPassword(data.password || 'password123');

    return prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
      },
    });
  }

  async update(id: string, data: any) {
    if (data.password) {
      data.password = await hashPassword(data.password);
    }

    return prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
      },
    });
  }

  async delete(id: string) {
    // Check if user exists
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Delete related data if necessary, or just deactivate
    // For simplicity, let's just delete for now (be careful with foreign keys)
    // Actually, it's safer to deactivate or check if they have work orders
    const hasWorkOrders = await prisma.workOrder.findFirst({
      where: { assignedMechanicId: id },
    });

    if (hasWorkOrders) {
      // If they have work orders, just deactivate them
      return prisma.user.update({
        where: { id },
        data: { isActive: false },
      });
    }

    return prisma.user.delete({
      where: { id },
    });
  }
}

export const userService = new UserService();
