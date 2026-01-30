import { Request, Response, NextFunction } from "express";
import type { GetRolePermissionsUseCase } from "./GetRolePermissionsUseCase.js";
import { getRolePermissionsSchema } from "@/schemas/getRolePermissionsSchema.js";
import { makeGetRolePermissionsUseCase } from "./GetRolePermissionsFactory.js";


export class GetRolePermissionsController {
  private getRolePermissionsUseCase: GetRolePermissionsUseCase;

  constructor() {
    this.getRolePermissionsUseCase = makeGetRolePermissionsUseCase();
  }

  async handle(req: Request, res: Response, next: NextFunction) {
    try {

      const safeValues = getRolePermissionsSchema.parse(req.query);
      const data = await this.getRolePermissionsUseCase.execute(safeValues);

      return res.status(200).json(data);

    } catch (error) {
      next(error);
    }
  }
}
