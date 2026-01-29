export type CreateAuditLogDTO = {
  actorUserId?: string | null
  action: string
  resourceType: string
  resourceId: string
  metadata?: Record<string, any>
  ipAddress?: string | null
  userAgent?: string | null
}

export interface IAuditLogRepository {
  create(data: CreateAuditLogDTO): Promise<void>
}