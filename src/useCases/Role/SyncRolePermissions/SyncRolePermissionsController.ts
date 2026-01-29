import { Request, Response, NextFunction } from "express";
import type { SyncRolePermissionsUseCase } from "./SyncRolePermissionsUseCase.js";
import { getRolePermissionsSchema } from "@/schemas/getRolePermissionsSchema.js";
import { updateRoleParamsSchema, updateRoleSchema } from "@/schemas/updateRoleSchema.js";
import { createRoleSchema } from "@/schemas/createRoleSchema.js";
import { syncRolePermissionsParamsSchema, syncRolePermissionsSchema } from "@/schemas/syncRolePermissionsSchema.js";
import { buildAuditCtx } from "@/utils/Audit.js";


export class SyncRolePermissionsController {
  constructor(private createRoleUseCase: SyncRolePermissionsUseCase) {
  }

  async handle(req: Request, res: Response, next: NextFunction) {
    try {
      const auditData = buildAuditCtx(req)

      const safeParamsValues = syncRolePermissionsParamsSchema.parse(req.params)

      const safeBodyValues = syncRolePermissionsSchema.parse(req.body)

      const data = await this.createRoleUseCase.execute(safeParamsValues.role_id, req.userId!, safeBodyValues,auditData);

      return res.status(200).json(data);

    } catch (error) {
      next(error)
    }
  }
}