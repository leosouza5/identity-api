import type { IRoleRepository } from "@/repositories/IRoleRepository.js"
import type { ICreateRoleDTO } from "./ICreateRoleDTO.js"
import { Role } from "@/entities/Role.js"
import type { IAuditLogRepository } from "@/repositories/IAuditLogRepository.js"

export class CreateRoleUseCase {
  constructor(private roleRepository: IRoleRepository, private auditLogRepository: IAuditLogRepository) {
  }


  async execute(data: ICreateRoleDTO, auditData: AuditCtx) {

    const role = new Role({ name: data.name, description: data.description })

    await this.roleRepository.create(role)

    try {
      await this.auditLogRepository.create({
        action: 'role:create',
        resourceId: role.name,
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