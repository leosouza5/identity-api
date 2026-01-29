import type { IAuditLogRepository } from "@/repositories/IAuditLogRepository.js"
import type { IRoleRepository } from "@/repositories/IRoleRepository.js"
import { AppError } from "@/utils/AppError.js"

export class DeleteRoleUseCase {
  constructor(private roleRepository: IRoleRepository, private auditLogRepository: IAuditLogRepository) {
  }

  async execute(role_id: string, auditData: AuditCtx) {

    const role = await this.roleRepository.getById(role_id)

    if (!role) {
      throw new AppError("Role not Found", 404)
    }
    await this.roleRepository.delete(role_id)

    try {
      await this.auditLogRepository.create({
        action: 'role:delete',
        resourceId: role_id,
        resourceType: 'Role',
        actorUserId: auditData.actorUserId,
        ipAddress: auditData.ipAddress,
        userAgent: auditData.userAgent,
        metadata: {
          name: role.name,
          description: role.description,
        }
      })
    } catch (error) {

    }
  }
}