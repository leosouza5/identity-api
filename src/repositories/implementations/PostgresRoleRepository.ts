
import { prisma } from '@/config/prismaClient.js';
import { Role } from '@/entities/Role.js';
import { Permission } from '@/entities/Permission.js';
import type { RolePermissionCreateManyInput } from '@/generated/models.js';
import type { IRoleRepository, UpdateRoleData } from '../IRoleRepository.js';

export class PostgresRoleRepository implements IRoleRepository {
  async create(role: Role): Promise<void> {
    await prisma.role.create({
      data: {
        name: role.name,
        description: role.description,
      }
    })
  }

  async getAll(): Promise<Role[]> {
    const roles = await prisma.role.findMany()
    return roles.map(role => new Role({
      name: role.name, createdAt: role.createdAt,
      description: role.description ?? undefined,
      id: role.id,
      updatedAt: role.updatedAt
    }))
  }

  async getById(id: string): Promise<Role | undefined> {
    const role = await prisma.role.findUnique({ where: { id } })

    if (!role) return undefined

    return new Role({
      name: role.name, createdAt: role.createdAt,
      description: role.description ?? undefined,
      id: role.id,
      updatedAt: role.updatedAt
    })
  }

  async listPermissions(roleId: string): Promise<Permission[]> {
    const role = await prisma.role.findUnique({
      where: { id: roleId },
      include: {
        permissions: {
          include: { permission: true }
        }
      }
    })

    if (!role) return []

    const prismaPermissions = role.permissions.map(
      permission => permission.permission
    )

    return prismaPermissions.
      map(permission => new Permission({
        id: permission.id,
        key: permission.key,
        description: permission.description ?? undefined,
        updatedAt: permission.updatedAt,
        createdAt: permission.createdAt,
      }))
  }

  async listPermissionsIds(roleId: string): Promise<string[]> {
    const rows = await prisma.rolePermission.findMany({ select: { permissionId: true }, where: { roleId } })
    return rows.map(r => r.permissionId)
  }

  async syncRolePermissions(roleId: string, permissionsToAdd: string[], permissionsToRemove: string[], userId: string): Promise<void> {
    const rolePermissionsToCreate: RolePermissionCreateManyInput[] = []

    permissionsToAdd.forEach(permissionId => rolePermissionsToCreate.push({ roleId, permissionId, assignedByUserId: userId }))

    await prisma.$transaction([
      prisma.rolePermission.deleteMany({ where: { roleId, permissionId: { in: permissionsToRemove } } }),
      prisma.rolePermission.createMany({ data: rolePermissionsToCreate })
    ])
  }

  async update(id: string, updateRoleData: UpdateRoleData): Promise<void> {
    await prisma.role.update({
      data: updateRoleData,
      where: { id }
    })
  }

  async delete(roleId: string): Promise<void> {
    await prisma.$transaction([
      prisma.rolePermission.deleteMany({ where: { roleId } }),
      prisma.role.delete({ where: { id: roleId } })
    ])
  }
} 