import type { IAuditLogRepository } from '@/repositories/IAuditLogRepository.js'
import type { IRoleRepository } from '@/repositories/IRoleRepository.js'
import { DeleteRoleUseCase } from '@/useCases/Role/DeleteRole/DeleteRoleUseCase.js'
import { AppError } from '@/utils/AppError.js'
import { Role } from '@/entities/Role.js'
import { beforeEach, describe, expect, it } from 'vitest'
import { mock, type MockProxy } from 'vitest-mock-extended'

describe("DeleteRoleUseCase", () => {
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

  it("should throw when role is not found", async () => {
    roleRepository.getById.mockResolvedValue(undefined)

    const useCase = new DeleteRoleUseCase(roleRepository, auditLogRepository)

    await expect(useCase.execute("role-1", auditCtx)).rejects.toBeInstanceOf(AppError)

    expect(roleRepository.delete).not.toHaveBeenCalled()
  })

  it("should delete role and create audit log", async () => {
    const role = new Role({ id: "role-1", name: "Admin", description: "Admin" })
    roleRepository.getById.mockResolvedValue(role)

    const useCase = new DeleteRoleUseCase(roleRepository, auditLogRepository)

    await useCase.execute("role-1", auditCtx)

    expect(roleRepository.delete).toHaveBeenCalledWith("role-1")
    expect(auditLogRepository.create).toHaveBeenCalledWith(expect.objectContaining({
      action: "role:delete",
      resourceType: "Role",
      resourceId: "role-1",
      actorUserId: auditCtx.actorUserId,
      ipAddress: auditCtx.ipAddress,
      userAgent: auditCtx.userAgent,
      metadata: { name: role.name, description: role.description },
    }))
  })
})
