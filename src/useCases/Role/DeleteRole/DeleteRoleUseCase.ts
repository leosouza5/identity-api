import type { IRoleRepository } from "@/repositories/IRoleRepository.js"
import { AppError } from "@/utils/AppError.js"

export class DeleteRoleUseCase {
  constructor(private roleRepository: IRoleRepository) {
  }

  async execute(role_id: string) {

    const role = await this.roleRepository.getById(role_id)

    if (!role) {
      throw new AppError("Role not Found", 404)
    }

    return await this.roleRepository.delete(role_id)
  }
}