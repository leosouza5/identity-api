import { User, type UserStatus } from '@/entities/User.js';

import type { IUserRepository } from '../IUserRepository.js';
import { prisma } from '@/config/prismaClient.js';
import type { UserRolesCreateManyInput } from '../../../generated/prisma/models.js';

export class PostgresUserRepository implements IUserRepository {
  async save(user: User): Promise<void> {
    await prisma.user.create({
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        passwordHash: user.passwordHash,
        status: user.status,
      }
    })
  }

  async findByEmail(email: string): Promise<User | null> {
    const userRecord = await prisma.user.findUnique({ where: { email } })

    if (userRecord) {
      return new User({
        id: userRecord.id,
        name: userRecord.name,
        email: userRecord.email,
        passwordHash: userRecord.passwordHash,
        status: userRecord.status as UserStatus,
        createdAt: userRecord.createdAt,
        updatedAt: userRecord.updatedAt,
      })
    }

    return null
  }

  async findById(userId: string): Promise<User | null> {
    const userRecord = await prisma.user.findUnique({ where: { id: userId } })

    if (userRecord) {
      return new User({
        id: userRecord.id,
        name: userRecord.name,
        email: userRecord.email,
        passwordHash: userRecord.passwordHash,
        status: userRecord.status as UserStatus,
        createdAt: userRecord.createdAt,
        updatedAt: userRecord.updatedAt,
      })
    }

    return null

  }

  async syncUserRoles(userId: string, loggedUserId: string, rolesToAdd: string[], rolesToRemove: string[]): Promise<void> {
    const rolesDataToAdd: UserRolesCreateManyInput[] = []

    rolesToAdd.forEach(roleId => {
      rolesDataToAdd.push({ roleId, userId, assignedByUserId: loggedUserId })
    })

    await prisma.$transaction([
      prisma.userRoles.deleteMany({
        where: {
          userId,
          roleId: { in: rolesToRemove }
        }
      }),
      prisma.userRoles.createMany({
        data: rolesDataToAdd,
        skipDuplicates: true
      })
    ])

  }

  async listRolesIdsByUserId(userId: string): Promise<string[]> {

    const rows = await prisma.userRoles.findMany({
      select: { roleId: true },
      where: { userId }
    })

    return rows.map(r => r.roleId)

  }
} 