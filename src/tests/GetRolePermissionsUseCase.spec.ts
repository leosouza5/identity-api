import type { IRoleRepository } from '@/repositories/IRoleRepository.js'
import { Permission } from '@/entities/Permission.js'
import { GetRolePermissionsUseCase } from '@/useCases/Role/GetRolePermissions/GetRolePermissionsUseCase.js'
import { beforeEach, describe, expect, it } from 'vitest'
import { mock, type MockProxy } from 'vitest-mock-extended'

describe("GetRolePermissionsUseCase", () => {
  let roleRepository: MockProxy<IRoleRepository>

  beforeEach(() => {
    roleRepository = mock<IRoleRepository>()
  })

  it("should return role permissions", async () => {
    const permissions = [new Permission({ key: "perm:read" })]
    roleRepository.listPermissions.mockResolvedValue(permissions)

    const useCase = new GetRolePermissionsUseCase(roleRepository)
    const result = await useCase.execute({ role_id: "role-1" })

    expect(roleRepository.listPermissions).toHaveBeenCalledWith("role-1")
    expect(result).toEqual(permissions)
  })
})
