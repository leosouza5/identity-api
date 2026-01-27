import type { IRoleRepository } from "@/repositories/IRoleRepository.js"
import type { IGetRolePermissionsDTO } from "./IGetRolePermissionsDTO.js"

export class GetRolePermissionsUseCase {
  constructor(private roleRepository: IRoleRepository) {
  }

  async execute(data: IGetRolePermissionsDTO) {
    const permissions = await this.roleRepository.listPermissions(data.role_id)

    return permissions
  }
}