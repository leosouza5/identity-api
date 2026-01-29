import type { IRoleRepository } from "@/repositories/IRoleRepository.js"
import type { IUpdateRoleDTO } from "./IUpdateRoleDTO.js"
import { AppError } from "@/utils/AppError.js"
import type { IAuditLogRepository } from "@/repositories/IAuditLogRepository.js"

export class UpdateRoleUseCase {
  constructor(private roleRepository: IRoleRepository, private auditLogRepository: IAuditLogRepository) {
  }

  async execute(role_id: string, data: IUpdateRoleDTO, auditData: AuditCtx) {

    const role = await this.roleRepository.getById(role_id)

    if (!role) {
      throw new AppError("Role not Found", 404)
    }

    await this.roleRepository.update(role_id, { description: data.description, name: data.name })

    try {
      await this.auditLogRepository.create({
        action: 'role:update',
        resourceId: role_id,
        resourceType: 'Role',
        actorUserId: auditData.actorUserId,
        ipAddress: auditData.ipAddress,
        userAgent: auditData.userAgent,
        metadata: data,
      })
    } catch (error) {

    }
  }
}