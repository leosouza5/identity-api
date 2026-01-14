import { User, type UserStatus } from '@/entities/User.js';

import type { IUserRepository } from '../IUserRepository.js';
import { prisma } from './prismaClient.js'

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
} 