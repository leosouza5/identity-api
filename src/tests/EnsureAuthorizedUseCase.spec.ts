import type { IAuthorizationRepository } from '@/repositories/IAuthorizationRepository.js'
import type { IUserRepository } from '@/repositories/IUserRepository.js'
import { EnsureAuthorizedUseCase } from '@/useCases/Authorization/EnsureAuthorized/EnsureAuthorizedUseCase.js'
import { AppError } from '@/utils/AppError.js'
import { Permission } from '@/entities/Permission.js'
import { User } from '@/entities/User.js'
import { beforeEach, describe, expect, it } from 'vitest'
import { mock, type MockProxy } from 'vitest-mock-extended'

describe("EnsureAuthorizedUseCase", () => {
  let userRepository: MockProxy<IUserRepository>
  let authorizationRepository: MockProxy<IAuthorizationRepository>

  beforeEach(() => {
    userRepository = mock<IUserRepository>()
    authorizationRepository = mock<IAuthorizationRepository>()
  })

  it("should throw when user does not exist", async () => {
    userRepository.findById.mockResolvedValue(null)

    const useCase = new EnsureAuthorizedUseCase(userRepository, authorizationRepository)

    await expect(useCase.execute({ userId: "user-1", permissions: ["perm:a"] }))
      .rejects.toBeInstanceOf(AppError)

    expect(authorizationRepository.getPermissionsByUserId).not.toHaveBeenCalled()
  })

  it("should throw when user lacks permission", async () => {
    const user = new User({
      id: "user-1",
      name: "User",
      email: "user@test.com",
      passwordHash: "hash",
    })

    userRepository.findById.mockResolvedValue(user)
    authorizationRepository.getPermissionsByUserId.mockResolvedValue([
      new Permission({ key: "perm:read" }),
    ])

    const useCase = new EnsureAuthorizedUseCase(userRepository, authorizationRepository)

    await expect(useCase.execute({ userId: "user-1", permissions: ["perm:write"] }))
      .rejects.toBeInstanceOf(AppError)
  })

  it("should allow when user has required permission", async () => {
    const user = new User({
      id: "user-1",
      name: "User",
      email: "user@test.com",
      passwordHash: "hash",
    })

    userRepository.findById.mockResolvedValue(user)
    authorizationRepository.getPermissionsByUserId.mockResolvedValue([
      new Permission({ key: "perm:read" }),
    ])

    const useCase = new EnsureAuthorizedUseCase(userRepository, authorizationRepository)

    await expect(useCase.execute({ userId: "user-1", permissions: ["perm:read"] }))
      .resolves.toBeUndefined()
  })
})
