import { Request, Response, NextFunction } from "express";
import type { CreateRoleUseCase } from "./CreateRoleUseCase.js";
import { createRoleSchema } from "@/schemas/createRoleSchema.js";
import { buildAuditCtx } from "@/utils/Audit.js";
import { makeCreateRoleUseCase } from "./CreateRoleFactory.js";


export class CreateRoleController {
  private createRoleUseCase: CreateRoleUseCase;

  constructor() {
    this.createRoleUseCase = makeCreateRoleUseCase();
  }

  async handle(req: Request, res: Response, next: NextFunction) {
    try {
      const auditData = buildAuditCtx(req);

      const safeValues = createRoleSchema.parse(req.body);
      const data = await this.createRoleUseCase.execute(safeValues, auditData);

      return res.status(200).json(data);

    } catch (error) {
      next(error);
    }
  }
}
