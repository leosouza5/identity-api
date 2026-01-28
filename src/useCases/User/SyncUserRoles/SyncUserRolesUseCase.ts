import type { ISyncUserRolesDTO } from "./ISyncUserRolesDTO.js"
import type { IUserRepository } from "@/repositories/IUserRepository.js";

export class SyncUserRolesUseCase {
  constructor(private userRepository: IUserRepository) {
  }

  async execute(user_id: string, loggedUserId: string, data: ISyncUserRolesDTO) {
    const currentRoles = await this.userRepository.listRolesIdsByUserId(user_id)
    const currentRolesSet = new Set(currentRoles);

    const rolesToAdd = data.roles_ids.filter(
      newRole => !currentRolesSet.has(newRole)
    );

    const rolesToRemove = currentRoles.filter(
      currentRole => !data.roles_ids.includes(currentRole)
    );

    return await this.userRepository.syncUserRoles(user_id, loggedUserId, rolesToAdd, rolesToRemove)
  }
}