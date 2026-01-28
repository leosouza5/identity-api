
import { prisma } from '@/config/prismaClient.js';
import { Permission } from '@/entities/Permission.js';
import type { IAuthorizationRepository } from '../IAuthorizationRepository.js';

export class PostgresAuthorizationRepository implements IAuthorizationRepository {
  async getPermissionsByUserId(userId: string): Promise<Permission[]> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        userRoles: {
          select: {
            role: {
              select: {
                permissions: {
                  select: {
                    permission: true
                  }
                }
              }
            }
          }
        }
      }
    })

    if (!user) return []

    const prismaPermissions = user.userRoles.flatMap(ur =>
      ur.role.permissions.map(rp => rp.permission)
    )

    const unique = new Map<string, typeof prismaPermissions[number]>()
    for (const p of prismaPermissions) {
      unique.set(p.key, p)
    }

    return Array.from(unique.values()).map(perm => new Permission({
      id: perm.id,
      key: perm.key,
      createdAt: perm.createdAt,
      updatedAt: perm.updatedAt,
      description: perm.description ?? undefined,
    }))
  }
} 