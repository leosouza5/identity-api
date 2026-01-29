import { Request } from "express"

export function buildAuditCtx(req: Request) : AuditCtx{
  return {
    actorUserId: req.userId ?? null,
    ipAddress: req.ip ?? "",
    userAgent: req.get("user-agent") ?? null,
  }
}