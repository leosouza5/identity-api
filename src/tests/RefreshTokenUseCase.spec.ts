import type { IJwtProvider } from '@/providers/IJwtProvider.js'
import type { IRefreshTokenHasherProvider } from '@/providers/IRefreshTokenHasherProvider.js'
import type { IRefreshTokenRepository } from '@/repositories/IRefreshTokenRepository.js'
import { RefreshToken } from '@/entities/RefreshToken.js'
import { RefreshTokenUseCase } from '@/useCases/Auth/RefreshToken/RefreshTokenUseCase.js'
import { AppError } from '@/utils/AppError.js'
import { beforeEach, describe, expect, it } from 'vitest'
import { mock, type MockProxy } from 'vitest-mock-extended'

describe("RefreshTokenUseCase", () => {
  let refreshTokenRepository: MockProxy<IRefreshTokenRepository>
  let refreshTokenHasherProvider: MockProxy<IRefreshTokenHasherProvider>
  let jwtProvider: MockProxy<IJwtProvider>

  beforeEach(() => {
    refreshTokenRepository = mock<IRefreshTokenRepository>()
    refreshTokenHasherProvider = mock<IRefreshTokenHasherProvider>()
    jwtProvider = mock<IJwtProvider>()
  })

  it("should throw when refresh token is not found", async () => {
    refreshTokenHasherProvider.hash.mockResolvedValue("hashed")
    refreshTokenRepository.findByHash.mockResolvedValue(null)

    const useCase = new RefreshTokenUseCase(
      refreshTokenRepository,
      refreshTokenHasherProvider,
      jwtProvider
    )

    await expect(useCase.exec({ refreshToken: "plain" }, "user-1"))
      .rejects.toBeInstanceOf(AppError)

    expect(jwtProvider.generateToken).not.toHaveBeenCalled()
  })

  it("should throw when refresh token is expired", async () => {
    const expiredToken = new RefreshToken({
      id: "token-1",
      userId: "user-1",
      tokenHash: "hashed",
      expiresAt: new Date(Date.now() - 1000),
      revokedAt: null,
    })

    refreshTokenHasherProvider.hash.mockResolvedValue("hashed")
    refreshTokenRepository.findByHash.mockResolvedValue(expiredToken)

    const useCase = new RefreshTokenUseCase(
      refreshTokenRepository,
      refreshTokenHasherProvider,
      jwtProvider
    )

    await expect(useCase.exec({ refreshToken: "plain" }, "user-1"))
      .rejects.toBeInstanceOf(AppError)
  })

  it("should throw when refresh token is revoked", async () => {
    const revokedToken = new RefreshToken({
      id: "token-1",
      userId: "user-1",
      tokenHash: "hashed",
      expiresAt: new Date(Date.now() + 1000 * 60),
      revokedAt: new Date(),
    })

    refreshTokenHasherProvider.hash.mockResolvedValue("hashed")
    refreshTokenRepository.findByHash.mockResolvedValue(revokedToken)

    const useCase = new RefreshTokenUseCase(
      refreshTokenRepository,
      refreshTokenHasherProvider,
      jwtProvider
    )

    await expect(useCase.exec({ refreshToken: "plain" }, "user-1"))
      .rejects.toBeInstanceOf(AppError)
  })

  it("should return a new access token on success", async () => {
    const validToken = new RefreshToken({
      id: "token-1",
      userId: "user-1",
      tokenHash: "hashed",
      expiresAt: new Date(Date.now() + 1000 * 60),
      revokedAt: null,
    })

    refreshTokenHasherProvider.hash.mockResolvedValue("hashed")
    refreshTokenRepository.findByHash.mockResolvedValue(validToken)
    jwtProvider.generateToken.mockResolvedValue("new-jwt")

    const useCase = new RefreshTokenUseCase(
      refreshTokenRepository,
      refreshTokenHasherProvider,
      jwtProvider
    )

    const result = await useCase.exec({ refreshToken: "plain" }, "user-1")

    expect(result).toBe("new-jwt")
    expect(jwtProvider.generateToken).toHaveBeenCalledWith({ subject: "user-1" })
  })
})
