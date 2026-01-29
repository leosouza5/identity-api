import { Request, Response, NextFunction } from "express";
import type { DeleteRoleUseCase } from "./DeleteRoleUseCase.js";
import { getRolePermissionsSchema } from "@/schemas/getRolePermissionsSchema.js";
import { updateRoleParamsSchema, updateRoleSchema } from "@/schemas/updateRoleSchema.js";
import { deleteRoleSchema } from "@/schemas/deleteRoleSchema.js";
import { buildAuditCtx } from "@/utils/Audit.js";


export class DeleteRoleController {
  constructor(private deleteRoleUseCase: DeleteRoleUseCase) {
  }

  async handle(req: Request, res: Response, next: NextFunction) {
    try {
      const auditData = buildAuditCtx(req)

      const { role_id } = deleteRoleSchema.parse(req.params)

      const data = await this.deleteRoleUseCase.execute(role_id,auditData);

      return res.status(200).json(data);

    } catch (error) {
      next(error)
    }
  }
}