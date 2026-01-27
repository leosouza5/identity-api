import { Request, Response, NextFunction } from "express";
import type { CreateRoleUseCase } from "./CreateRoleUseCase.js";
import { getRolePermissionsSchema } from "@/schemas/getRolePermissionsSchema.js";
import { updateRoleParamsSchema, updateRoleSchema } from "@/schemas/updateRoleSchema.js";
import { createRoleSchema } from "@/schemas/createRoleSchema.js";


export class CreateRoleController {
  constructor(private createRoleUseCase: CreateRoleUseCase) {
  }

  async handle(req: Request, res: Response, next: NextFunction) {
    try {


      const safeValues = createRoleSchema.parse(req.body)
      const data = await this.createRoleUseCase.execute(safeValues);

      return res.status(200).json(data);

    } catch (error) {
      next(error)
    }
  }
}