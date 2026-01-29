declare namespace Express {
  export interface Request {
    userId?: string
  }
}

type AuditCtx = {
  actorUserId: string | null
  ipAddress: string | null
  userAgent: string | null
}