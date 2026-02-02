import type { IAuditLogRepository } from '@/repositories/IAuditLogRepository.js'
import type { IRoleRepository } from '@/repositories/IRoleRepository.js'
import { Role } from '@/entities/Role.js'
import { CreateRoleUseCase } from '@/useCases/Role/CreateRole/CreateRoleUseCase.js'
import { beforeEach, describe, expect, it } from 'vitest'
import { mock, type MockProxy } from 'vitest-mock-extended'

describe("CreateRoleUseCase", () => {
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

  it("should create role and log audit", async () => {
    const useCase = new CreateRoleUseCase(roleRepository, auditLogRepository)

    await useCase.execute({ name: "Admin", description: "Admin role" }, auditCtx)

    expect(roleRepository.create).toHaveBeenCalled()
    const createdRole = roleRepository.create.mock.calls[0][0]
    expect(createdRole).toBeInstanceOf(Role)
    expect(auditLogRepository.create).toHaveBeenCalledWith(expect.objectContaining({
      action: "role:create",
      resourceType: "Role",
      resourceId: createdRole.name,
      actorUserId: auditCtx.actorUserId,
      ipAddress: auditCtx.ipAddress,
      userAgent: auditCtx.userAgent,
      metadata: { name: "Admin", description: "Admin role" },
    }))
  })
})
