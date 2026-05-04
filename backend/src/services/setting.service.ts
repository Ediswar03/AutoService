// src/services/setting.service.ts

import { prisma } from '../config/database.config';

export class SettingService {
  async getAll() {
    return prisma.setting.findMany();
  }

  async getByKey(key: string) {
    return prisma.setting.findUnique({
      where: { key },
    });
  }

  async update(key: string, value: string, group: string = 'GENERAL', description?: string) {
    return prisma.setting.upsert({
      where: { key },
      update: { value, updatedAt: new Date() },
      create: { key, value, group, description },
    });
  }

  async updateMany(settings: { key: string; value: string; group?: string; description?: string }[]) {
    const results = [];
    for (const setting of settings) {
      const res = await this.update(setting.key, setting.value, setting.group, setting.description);
      results.push(res);
    }
    return results;
  }

  async getGroup(group: string) {
    return prisma.setting.findMany({
      where: { group },
    });
  }
}

export const settingService = new SettingService();
