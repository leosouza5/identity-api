import type { IPasswordHasherProvider } from '@/providers/IPasswordHasherProvider.js'
import type { IAuditLogRepository } from '@/repositories/IAuditLogRepository.js'
import type { IUserRepository } from '@/repositories/IUserRepository.js'
import { CreateUserUseCase } from '@/useCases/User/CreateUser/CreateUserUseCase.js'
import { AppError } from '@/utils/AppError.js'
import { beforeEach, describe, expect, it } from 'vitest'
import { mock, type MockProxy } from 'vitest-mock-extended'

describe("CreateUserUseCase", () => {
  let userRepository: MockProxy<IUserRepository>
  let passwordHashProvider: MockProxy<IPasswordHasherProvider>
  let auditLogRepository: MockProxy<IAuditLogRepository>

  const auditCtx = {
    actorUserId: "actor-1",
    ipAddress: "127.0.0.1",
    userAgent: "vitest",
  }

  beforeEach(() => {
    userRepository = mock<IUserRepository>()
    passwordHashProvider = mock<IPasswordHasherProvider>()
    auditLogRepository = mock<IAuditLogRepository>()
  })

  it("should create a new user and create audit log", async () => {
    userRepository.findByEmail.mockResolvedValue(null)
    passwordHashProvider.hash.mockResolvedValue("hashed-password")

    const useCase = new CreateUserUseCase(userRepository, passwordHashProvider, auditLogRepository)
    const result = await useCase.execute({
      name: "Test User",
      email: "test@email.com",
      password: "password",
    }, auditCtx)

    expect(userRepository.findByEmail).toHaveBeenCalledWith("test@email.com")
    expect(passwordHashProvider.hash).toHaveBeenCalledWith("password")
    expect(userRepository.save).toHaveBeenCalled()
    expect(auditLogRepository.create).toHaveBeenCalledWith(expect.objectContaining({
      action: "user:create",
      resourceType: "User",
      actorUserId: auditCtx.actorUserId,
      ipAddress: auditCtx.ipAddress,
      userAgent: auditCtx.userAgent,
    }))
    expect(result.id).toBeDefined()
  })

  it("deve lancar erro se email ja existir", async () => {
    userRepository.findByEmail.mockResolvedValue({} as any)

    const useCase = new CreateUserUseCase(
      userRepository,
      passwordHashProvider,
      auditLogRepository
    )

    await expect(
      useCase.execute(
        { name: "Leo", email: "leo@test.com", password: "123" },
        auditCtx as any
      )
    ).rejects.toBeInstanceOf(AppError)

    expect(passwordHashProvider.hash).not.toHaveBeenCalled()
    expect(auditLogRepository.create).not.toHaveBeenCalled()
  })
})
