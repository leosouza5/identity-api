
import { prisma } from '@/config/prismaClient.js';
import type { IRefreshTokenRepository } from '../IRefreshTokenRepository.js';
import  { RefreshToken } from '@/entities/RefreshToken.js';

export class PostgresRefreshTokenRepository implements IRefreshTokenRepository {
  async save(refreshToken: RefreshToken): Promise<void> {
    await prisma.refreshToken.create({
      data: {
        id: refreshToken.id,
        userId: refreshToken.userId,
        tokenHash: refreshToken.tokenHash,
        expriresAt: refreshToken.expiresAt,
        revokedAt: refreshToken.revokedAt ?? null,
        createdAt: refreshToken.createdAt,
      },
    })
  }

  async findByHash(hash: string): Promise<RefreshToken | null> {
    const record = await prisma.refreshToken.findUnique({
      where: { tokenHash: hash },
    })

    if (!record) {
      return null
    }

    return new RefreshToken({
      id: record.id,
      userId: record.userId,
      tokenHash: record.tokenHash,
      expiresAt: record.expriresAt,
      revokedAt: record.revokedAt,
      createdAt: record.createdAt,
    })
  }

  async revokeById(id: string): Promise<void> {
    await prisma.refreshToken.update({
      where: { id },
      data: { revokedAt: new Date() },
    })
  }
} 
