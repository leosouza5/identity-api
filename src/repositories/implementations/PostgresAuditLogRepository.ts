import { prisma } from "@/config/prismaClient.js"
import type { IAuditLogRepository, CreateAuditLogDTO } from "../IAuditLogRepository.js"

export class PostgresAuditLogRepository implements IAuditLogRepository {

  async create(data: CreateAuditLogDTO): Promise<void> {
    await prisma.auditLog.create({
      data: {
        actorUserId: data.actorUserId ?? null,
        action: data.action,
        resourceType: data.resourceType,
        resourceId: data.resourceId,
        metadata: data.metadata ?? {},
        ipAddress: data.ipAddress ?? null,
        userAgent: data.userAgent ?? null,
      },
    })
  }
}