import { Request, Response, NextFunction } from "express";
import type { SyncRolePermissionsUseCase } from "./SyncRolePermissionsUseCase.js";
import { syncRolePermissionsParamsSchema, syncRolePermissionsSchema } from "@/schemas/syncRolePermissionsSchema.js";
import { buildAuditCtx } from "@/utils/Audit.js";
import { makeSyncRolePermissionsUseCase } from "./SyncRolePermissionsFactory.js";


export class SyncRolePermissionsController {
  private syncRolePermissionsUseCase: SyncRolePermissionsUseCase;

  constructor() {
    this.syncRolePermissionsUseCase = makeSyncRolePermissionsUseCase();
  }

  async handle(req: Request, res: Response, next: NextFunction) {
    try {
      const auditData = buildAuditCtx(req);

      const safeParamsValues = syncRolePermissionsParamsSchema.parse(req.params);

      const safeBodyValues = syncRolePermissionsSchema.parse(req.body);

      const data = await this.syncRolePermissionsUseCase.execute(
        safeParamsValues.role_id,
        req.userId!,
        safeBodyValues,
        auditData
      );

      return res.status(200).json(data);

    } catch (error) {
      next(error);
    }
  }
}
