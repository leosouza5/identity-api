import type { IRefreshTokenHasherProvider } from "@/providers/IRefreshTokenHasherProvider.js";
import type { IRefreshTokenRepository } from "@/repositories/IRefreshTokenRepository.js";
import type { IRefreshTokenRequestDTO } from "./IRefreshTokenUseCaseDTO.js";
import { AppError } from "@/utils/AppError.js";
import type { IJwtProvider } from "@/providers/IJwtProvider.js";

export class RefreshTokenUseCase {
  constructor(private refreshTokenRepository: IRefreshTokenRepository, private refreshTokenHasherProvider: IRefreshTokenHasherProvider, private jwtProvider: IJwtProvider) {
  }

  async exec(data: IRefreshTokenRequestDTO, userId: string): Promise<string> {
    const hashedIncomingRefreshToken = await this.refreshTokenHasherProvider.hash(data.refreshToken)
    const refreshToken = await this.refreshTokenRepository.findByHash(hashedIncomingRefreshToken)
    const now = new Date()

    if (!refreshToken) {
      throw new AppError("Refresh Token Not Found")
    }

    const expired = refreshToken.expiresAt < now
    const revoked = refreshToken.revokedAt != null

    if (expired || revoked) {
      throw new AppError("Refresh Token Expired")
    }

    const newAccessToken = await this.jwtProvider.generateToken({ subject: refreshToken.userId })
    await this.refreshTokenRepository.revokeById(refreshToken.id!)
    return newAccessToken
  }
} 