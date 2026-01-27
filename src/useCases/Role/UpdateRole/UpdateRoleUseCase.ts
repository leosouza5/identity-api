import type { IRoleRepository } from "@/repositories/IRoleRepository.js"
import type { IUpdateRoleDTO } from "./IUpdateRoleDTO.js"
import { AppError } from "@/utils/AppError.js"

export class UpdateRoleUseCase {
  constructor(private roleRepository: IRoleRepository) {
  }

  async execute(role_id: string, data: IUpdateRoleDTO) {

    const role = await this.roleRepository.getById(role_id)

    if(!role){
      throw new AppError("Role not Found",404)
    }

    return await this.roleRepository.update(role_id, { description: data.description, name: data.name })
  }
}