import type { IRoleRepository } from "@/repositories/IRoleRepository.js"

export class ListRolesUseCase {
  constructor(private roleRepository: IRoleRepository) {
  }

  async execute() {
    const roles = await this.roleRepository.getAll()

    return roles
  }
}