
import { prisma } from '@/config/prismaClient.js';
import type { IRefreshTokenRepository } from '../IRefreshTokenRepository.js';
import type { RefreshToken } from '@/entities/RefreshToken.js';

export class PostgresRefreshTokenRepository implements IRefreshTokenRepository {
  async save(refreshToken: RefreshToken): Promise<void> {
    
  }

  async findByHash(hash: string): Promise<RefreshToken | null> {
    return null
  }

  async revokeById(id: string): Promise<void> {
    
  }
} 