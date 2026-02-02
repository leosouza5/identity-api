import type { IJwtProvider } from '@/providers/IJwtProvider.js'
import type { IPasswordHasherProvider } from '@/providers/IPasswordHasherProvider.js'
import type { IRefreshTokenHasherProvider } from '@/providers/IRefreshTokenHasherProvider.js'
import type { IRefreshTokenRepository } from '@/repositories/IRefreshTokenRepository.js'
import type { IUserRepository } from '@/repositories/IUserRepository.js'
import { LoginUseCase } from '@/useCases/Auth/Login/LoginUseCase.js'
import { AppError } from '@/utils/AppError.js'
import { User } from '@/entities/User.js'
import { beforeEach, describe, expect, it } from 'vitest'
import { mock, type MockProxy } from 'vitest-mock-extended'

describe("LoginUseCase", () => {
  let refreshTokenHasherProvider: MockProxy<IRefreshTokenHasherProvider>
  let jwtProvider: MockProxy<IJwtProvider>
  let userRepository: MockProxy<IUserRepository>
  let refreshTokenRepository: MockProxy<IRefreshTokenRepository>
  let passwordHasherProvider: MockProxy<IPasswordHasherProvider>

  beforeEach(() => {
    refreshTokenHasherProvider = mock<IRefreshTokenHasherProvider>()
    jwtProvider = mock<IJwtProvider>()
    userRepository = mock<IUserRepository>()
    refreshTokenRepository = mock<IRefreshTokenRepository>()
    passwordHasherProvider = mock<IPasswordHasherProvider>()
  })

  it("should throw when user is not found", async () => {
    userRepository.findByEmail.mockResolvedValue(null)

    const useCase = new LoginUseCase(
      refreshTokenHasherProvider,
      jwtProvider,
      userRepository,
      refreshTokenRepository,
      passwordHasherProvider
    )

    await expect(useCase.execute({ email: "test@email.com", password: "123" }))
      .rejects.toBeInstanceOf(AppError)

    expect(passwordHasherProvider.compare).not.toHaveBeenCalled()
    expect(refreshTokenRepository.save).not.toHaveBeenCalled()
  })

  it("should throw when password does not match", async () => {
    const user = new User({
      id: "user-1",
      name: "Test",
      email: "test@email.com",
      passwordHash: "hashed",
    })

    userRepository.findByEmail.mockResolvedValue(user)
    passwordHasherProvider.compare.mockResolvedValue(false)

    const useCase = new LoginUseCase(
      refreshTokenHasherProvider,
      jwtProvider,
      userRepository,
      refreshTokenRepository,
      passwordHasherProvider
    )

    await expect(useCase.execute({ email: "test@email.com", password: "123" }))
      .rejects.toBeInstanceOf(AppError)

    expect(refreshTokenRepository.save).not.toHaveBeenCalled()
  })

  it("should return access and refresh tokens on success", async () => {
    const user = new User({
      id: "user-1",
      name: "Test",
      email: "test@email.com",
      passwordHash: "hashed",
    })

    userRepository.findByEmail.mockResolvedValue(user)
    passwordHasherProvider.compare.mockResolvedValue(true)
    refreshTokenHasherProvider.hash.mockResolvedValue("hashed-refresh")
    jwtProvider.generateToken.mockResolvedValue("jwt-token")

    const useCase = new LoginUseCase(
      refreshTokenHasherProvider,
      jwtProvider,
      userRepository,
      refreshTokenRepository,
      passwordHasherProvider
    )

    const result = await useCase.execute({ email: "test@email.com", password: "123" })

    expect(result.accessToken).toBe("jwt-token")
    expect(result.refreshToken).toEqual(expect.any(String))
    expect(refreshTokenHasherProvider.hash).toHaveBeenCalledWith(expect.any(String))
    expect(refreshTokenRepository.save).toHaveBeenCalled()
    const savedToken = refreshTokenRepository.save.mock.calls[0][0]
    expect(savedToken.userId).toBe(user.id)
    expect(savedToken.tokenHash).toBe("hashed-refresh")
    expect(jwtProvider.generateToken).toHaveBeenCalledWith({ subject: user.id })
  })

  it("should throw when refresh token cannot be saved", async () => {
    const user = new User({
      id: "user-1",
      name: "Test",
      email: "test@email.com",
      passwordHash: "hashed",
    })

    userRepository.findByEmail.mockResolvedValue(user)
    passwordHasherProvider.compare.mockResolvedValue(true)
    refreshTokenHasherProvider.hash.mockResolvedValue("hashed-refresh")
    refreshTokenRepository.save.mockRejectedValue(new Error("db"))

    const useCase = new LoginUseCase(
      refreshTokenHasherProvider,
      jwtProvider,
      userRepository,
      refreshTokenRepository,
      passwordHasherProvider
    )

    await expect(useCase.execute({ email: "test@email.com", password: "123" }))
      .rejects.toBeInstanceOf(AppError)
  })
})
