import type { IPermissionRepository } from '@/repositories/IPermissionRepository.js'
import { Permission } from '@/entities/Permission.js'
import { ListPermissionsUseCase } from '@/useCases/Permission/ListRoles/ListPermissionsUseCase.js'
import { beforeEach, describe, expect, it } from 'vitest'
import { mock, type MockProxy } from 'vitest-mock-extended'

describe("ListPermissionsUseCase", () => {
  let permissionRepository: MockProxy<IPermissionRepository>

  beforeEach(() => {
    permissionRepository = mock<IPermissionRepository>()
  })

  it("should return permissions from repository", async () => {
    const permissions = [new Permission({ key: "perm:read" })]
    permissionRepository.getAll.mockResolvedValue(permissions)

    const useCase = new ListPermissionsUseCase(permissionRepository)
    const result = await useCase.execute()

    expect(permissionRepository.getAll).toHaveBeenCalled()
    expect(result).toEqual(permissions)
  })
})
