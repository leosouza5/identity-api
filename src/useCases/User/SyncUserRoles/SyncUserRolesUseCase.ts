import type { IAuditLogRepository } from "@/repositories/IAuditLogRepository.js";
import type { ISyncUserRolesDTO } from "./ISyncUserRolesDTO.js"
import type { IUserRepository } from "@/repositories/IUserRepository.js";

export class SyncUserRolesUseCase {
  constructor(private userRepository: IUserRepository, private auditLogRepository: IAuditLogRepository) {
  }

  async execute(user_id: string, loggedUserId: string, data: ISyncUserRolesDTO, auditData: AuditCtx) {
    const currentRoles = await this.userRepository.listRolesIdsByUserId(user_id)
    const currentRolesSet = new Set(currentRoles);

    const rolesToAdd = data.roles_ids.filter(
      newRole => !currentRolesSet.has(newRole)
    );

    const rolesToRemove = currentRoles.filter(
      currentRole => !data.roles_ids.includes(currentRole)
    );

    await this.userRepository.syncUserRoles(user_id, loggedUserId, rolesToAdd, rolesToRemove)
    try {
      await this.auditLogRepository.create({
        action: 'user:sync_roles',
        resourceId: user_id,
        resourceType: 'User',
        actorUserId: auditData.actorUserId,
        userAgent: auditData.userAgent,
        ipAddress: auditData.ipAddress,
        metadata: {
          currentRoles,
          rolesToAdd,
          rolesToRemove,
        },
      })
    } catch { }

  }
}