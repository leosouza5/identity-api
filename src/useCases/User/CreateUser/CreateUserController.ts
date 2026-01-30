import { Request, Response, NextFunction } from "express";

import type { CreateUserUseCase } from "./CreateUserUseCase.js";
import type { ICreateUserRequestDTO } from "./ICreateUserDTO.js";
import { userSchema } from "@/schemas/userSchema.js";
import { buildAuditCtx } from "@/utils/Audit.js";
import { makeCreateUserUseCase } from "./CreateUserFactory.js";

export class CreateUserController {
  private createUserUseCase: CreateUserUseCase;

  constructor() {
    this.createUserUseCase = makeCreateUserUseCase();
  }

  async handle(req: Request, res: Response, next: NextFunction) {
    try {
      const auditData = buildAuditCtx(req);

      const safeValues: ICreateUserRequestDTO = userSchema.parse(req.body);

      const data = await this.createUserUseCase.execute(safeValues, auditData);

      return res.status(201).json(data);

    } catch (error) {
      next(error);
    }
  }
}
