import type { IRoleRepository } from "@/repositories/IRoleRepository.js"
import type { ISyncRolePermissionsDTO } from "./ISyncRolePermissionsDTO.js"

export class SyncRolePermissionsUseCase {
  constructor(private roleRepository: IRoleRepository) {
  }

  async execute(role_id: string, user_id: string, data: ISyncRolePermissionsDTO) {

    const currentPermissions = await this.roleRepository.listPermissionsIds(role_id)
    const currentPermissionsSet = new Set(currentPermissions);



    const permissionsToAdd = data.permissions_ids.filter(
      newPermission => !currentPermissionsSet.has(newPermission)
    );

    const permissionsToRemove = currentPermissions.filter(
      currentPermission => !data.permissions_ids.includes(currentPermission)
    );

    return await this.roleRepository.syncRolePermissions(role_id, permissionsToAdd, permissionsToRemove, user_id)
  }
}