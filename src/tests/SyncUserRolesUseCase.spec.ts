import type { IAuditLogRepository } from '@/repositories/IAuditLogRepository.js'
import type { IUserRepository } from '@/repositories/IUserRepository.js'
import { SyncUserRolesUseCase } from '@/useCases/User/SyncUserRoles/SyncUserRolesUseCase.js'
import { beforeEach, describe, expect, it } from 'vitest'
import { mock, type MockProxy } from 'vitest-mock-extended'

describe("SyncUserRolesUseCase", () => {
  let userRepository: MockProxy<IUserRepository>
  let auditLogRepository: MockProxy<IAuditLogRepository>

  const auditCtx = {
    actorUserId: "actor-1",
    ipAddress: "127.0.0.1",
    userAgent: "vitest",
  }

  beforeEach(() => {
    userRepository = mock<IUserRepository>()
    auditLogRepository = mock<IAuditLogRepository>()
  })

  it("should sync user roles and create audit log", async () => {
    userRepository.listRolesIdsByUserId.mockResolvedValue(["role-1", "role-2"])

    const useCase = new SyncUserRolesUseCase(userRepository, auditLogRepository)

    await useCase.execute(
      "user-1",
      "admin-1",
      { roles_ids: ["role-2", "role-3"] },
      auditCtx
    )

    expect(userRepository.syncUserRoles).toHaveBeenCalledWith(
      "user-1",
      "admin-1",
      ["role-3"],
      ["role-1"]
    )
    expect(auditLogRepository.create).toHaveBeenCalledWith(expect.objectContaining({
      action: "user:sync_roles",
      resourceType: "User",
      resourceId: "user-1",
      actorUserId: auditCtx.actorUserId,
      ipAddress: auditCtx.ipAddress,
      userAgent: auditCtx.userAgent,
      metadata: {
        currentRoles: ["role-1", "role-2"],
        rolesToAdd: ["role-3"],
        rolesToRemove: ["role-1"],
      },
    }))
  })
})
