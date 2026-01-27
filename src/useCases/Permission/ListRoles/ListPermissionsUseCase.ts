import type { IPermissionRepository } from "@/repositories/IPermissionRepository.js"

export class ListPermissionsUseCase {
  constructor(private permissionRepository: IPermissionRepository) {
  }

  async execute() {
    const roles = await this.permissionRepository.getAll()

    return roles
  }
}