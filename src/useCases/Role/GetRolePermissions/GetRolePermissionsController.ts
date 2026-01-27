import { Request, Response, NextFunction } from "express";
import type { GetRolePermissionsUseCase } from "./GetRolePermissionsUseCase.js";
import { getRolePermissionsSchema } from "@/schemas/getRolePermissionsSchema.js";


export class GetRolePermissionsController {
  constructor(private getRolePermissionsUseCase: GetRolePermissionsUseCase) {
  }

  async handle(req: Request, res: Response, next: NextFunction) {
    try {

      const safeValues = getRolePermissionsSchema.parse(req.query)
      const data = await this.getRolePermissionsUseCase.execute(safeValues);

      return res.status(200).json(data);

    } catch (error) {
      next(error)
    }
  }
}