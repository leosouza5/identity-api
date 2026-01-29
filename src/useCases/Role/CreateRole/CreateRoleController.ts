import { Request, Response, NextFunction } from "express";
import type { CreateRoleUseCase } from "./CreateRoleUseCase.js";
import { createRoleSchema } from "@/schemas/createRoleSchema.js";
import type { IAuditLogRepository } from "@/repositories/IAuditLogRepository.js";
import { buildAuditCtx } from "@/utils/Audit.js";


export class CreateRoleController {
  constructor(private createRoleUseCase: CreateRoleUseCase, private auditLogRepository: IAuditLogRepository) {
  }

  async handle(req: Request, res: Response, next: NextFunction, auditData: AuditCtx) {
    try {

      const auditData = buildAuditCtx(req)

      const safeValues = createRoleSchema.parse(req.body)
      const data = await this.createRoleUseCase.execute(safeValues,auditData);

      
        return res.status(200).json(data);

      } catch (error) {
        next(error)
      }
    }
}