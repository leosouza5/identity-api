import { Request, Response, NextFunction } from "express";
import type { UpdateRoleUseCase } from "./UpdateRoleUseCase.js";
import { getRolePermissionsSchema } from "@/schemas/getRolePermissionsSchema.js";
import { updateRoleParamsSchema, updateRoleSchema } from "@/schemas/updateRoleSchema.js";
import { buildAuditCtx } from "@/utils/Audit.js";


export class UpdateRoleController {
  constructor(private updateRoleUseCase: UpdateRoleUseCase) {
  }

  async handle(req: Request, res: Response, next: NextFunction) {
    try {
      const auditData = buildAuditCtx(req)

      const { role_id } = updateRoleParamsSchema.parse(req.params)

      const safeBodyValues = updateRoleSchema.parse(req.body)
      const data = await this.updateRoleUseCase.execute(role_id, safeBodyValues,auditData);

      return res.status(200).json(data);

    } catch (error) {
      next(error)
    }
  }
}