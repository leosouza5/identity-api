import { Request, Response, NextFunction } from "express";
import { syncUserRolesParamsSchema, syncUserRolesSchema } from "@/schemas/syncUserRolesSchema.js";
import type { SyncUserRolesUseCase } from "./SyncUserRolesUseCase.js";


export class SyncUserRolesController {
  constructor(private createRoleUseCase: SyncUserRolesUseCase) {
  }

  async handle(req: Request, res: Response, next: NextFunction) {
    try {

      const safeParamsValues = syncUserRolesParamsSchema.parse(req.params)

      const safeBodyValues = syncUserRolesSchema.parse(req.body)

      const data = await this.createRoleUseCase.execute(safeParamsValues.user_id, req.userId!, safeBodyValues);

      return res.status(200).json(data);

    } catch (error) {
      next(error)
    }
  }
}