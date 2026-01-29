import { Request, Response, NextFunction } from "express";
import { syncUserRolesParamsSchema, syncUserRolesSchema } from "@/schemas/syncUserRolesSchema.js";
import type { SyncUserRolesUseCase } from "./SyncUserRolesUseCase.js";
import { buildAuditCtx } from "@/utils/Audit.js";


export class SyncUserRolesController {
  constructor(private createRoleUseCase: SyncUserRolesUseCase) {
  }

  async handle(req: Request, res: Response, next: NextFunction) {
    try {
      const auditData = buildAuditCtx(req)

      const safeParamsValues = syncUserRolesParamsSchema.parse(req.params)

      const safeBodyValues = syncUserRolesSchema.parse(req.body)

      const data = await this.createRoleUseCase.execute(safeParamsValues.user_id, req.userId!, safeBodyValues,auditData);

      return res.status(200).json(data);

    } catch (error) {
      next(error)
    }
  }
}