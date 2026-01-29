import type { IRoleRepository } from "@/repositories/IRoleRepository.js"
import type { ISyncRolePermissionsDTO } from "./ISyncRolePermissionsDTO.js"
import type { IAuditLogRepository } from "@/repositories/IAuditLogRepository.js";

export class SyncRolePermissionsUseCase {
  constructor(private roleRepository: IRoleRepository, private auditLogRepository: IAuditLogRepository) {
  }

  async execute(role_id: string, user_id: string, data: ISyncRolePermissionsDTO, auditData: AuditCtx) {

    const currentPermissions = await this.roleRepository.listPermissionsIds(role_id)
    const currentPermissionsSet = new Set(currentPermissions);



    const permissionsToAdd = data.permissions_ids.filter(
      newPermission => !currentPermissionsSet.has(newPermission)
    );

    const permissionsToRemove = currentPermissions.filter(
      currentPermission => !data.permissions_ids.includes(currentPermission)
    );

    await this.roleRepository.syncRolePermissions(role_id, permissionsToAdd, permissionsToRemove, user_id)
    try {

      await this.auditLogRepository.create({
        action: 'role:sync_permissions',
        resourceId: role_id,
        resourceType: 'Role',
        actorUserId: auditData.actorUserId,
        ipAddress: auditData.ipAddress,
        userAgent: auditData.userAgent,
        metadata: {
          currentPermissions,
          permissionsToAdd,
          permissionsToRemove
        }
      })
    } catch (error) {

    }
  }
}