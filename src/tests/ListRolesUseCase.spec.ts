import type { IRoleRepository } from '@/repositories/IRoleRepository.js'
import { Role } from '@/entities/Role.js'
import { ListRolesUseCase } from '@/useCases/Role/ListRoles/ListRolesUseCase.js'
import { beforeEach, describe, expect, it } from 'vitest'
import { mock, type MockProxy } from 'vitest-mock-extended'

describe("ListRolesUseCase", () => {
  let roleRepository: MockProxy<IRoleRepository>

  beforeEach(() => {
    roleRepository = mock<IRoleRepository>()
  })

  it("should return roles from repository", async () => {
    const roles = [new Role({ name: "Admin" })]
    roleRepository.getAll.mockResolvedValue(roles)

    const useCase = new ListRolesUseCase(roleRepository)
    const result = await useCase.execute()

    expect(roleRepository.getAll).toHaveBeenCalled()
    expect(result).toEqual(roles)
  })
})
