import type { IAuditLogRepository } from '@/repositories/IAuditLogRepository.js'
import type { IRoleRepository } from '@/repositories/IRoleRepository.js'
import { SyncRolePermissionsUseCase } from '@/useCases/Role/SyncRolePermissions/SyncRolePermissionsUseCase.js'
import { beforeEach, describe, expect, it } from 'vitest'
import { mock, type MockProxy } from 'vitest-mock-extended'

describe("SyncRolePermissionsUseCase", () => {
  let roleRepository: MockProxy<IRoleRepository>
  let auditLogRepository: MockProxy<IAuditLogRepository>

  const auditCtx = {
    actorUserId: "actor-1",
    ipAddress: "127.0.0.1",
    userAgent: "vitest",
  }

  beforeEach(() => {
    roleRepository = mock<IRoleRepository>()
    auditLogRepository = mock<IAuditLogRepository>()
  })

  it("should sync permissions and create audit log", async () => {
    roleRepository.listPermissionsIds.mockResolvedValue(["perm-1", "perm-2"])

    const useCase = new SyncRolePermissionsUseCase(roleRepository, auditLogRepository)

    await useCase.execute(
      "role-1",
      "user-1",
      { permissions_ids: ["perm-2", "perm-3"] },
      auditCtx
    )

    expect(roleRepository.syncRolePermissions).toHaveBeenCalledWith(
      "role-1",
      ["perm-3"],
      ["perm-1"],
      "user-1"
    )
    expect(auditLogRepository.create).toHaveBeenCalledWith(expect.objectContaining({
      action: "role:sync_permissions",
      resourceType: "Role",
      resourceId: "role-1",
      actorUserId: auditCtx.actorUserId,
      ipAddress: auditCtx.ipAddress,
      userAgent: auditCtx.userAgent,
      metadata: {
        currentPermissions: ["perm-1", "perm-2"],
        permissionsToAdd: ["perm-3"],
        permissionsToRemove: ["perm-1"],
      },
    }))
  })
})
