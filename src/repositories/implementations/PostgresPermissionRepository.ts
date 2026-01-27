
import { prisma } from '@/config/prismaClient.js';
import type { IPermissionRepository } from '../IPermissionRepository.js';
import { Permission } from '@/entities/Permission.js';

export class PostgresPermissionRepository implements IPermissionRepository {
  async create(permission: Permission): Promise<void> {
    await prisma.permission.create({
      data: {
        key: permission.key,
        description: permission.description
      }
    })
  }

  async getAll(): Promise<Permission[]> {
    const prismaPermissions = await prisma.permission.findMany()

    return prismaPermissions.map(row => new Permission({
      id: row.id,
      key: row.key,
      description: row.description ?? undefined,
      updatedAt: row.updatedAt,
      createdAt: row.createdAt,
    }))
  }
} 