import { Request, Response, NextFunction } from "express";

import type { CreateUserUseCase } from "./CreateUserUseCase.js";
import type { ICreateUserRequestDTO } from "./ICreateUserDTO.js";
import { userSchema } from "@/schemas/userSchema.js";

export class CreateUserController {
  constructor(private createUserUseCase: CreateUserUseCase) {
    this.createUserUseCase = createUserUseCase;
  }

  async handle(req: Request, res: Response, next: NextFunction) {
    try {
      const safeValues: ICreateUserRequestDTO = userSchema.parse(req.body);

      const data = await this.createUserUseCase.execute(safeValues);

      return res.status(201).json(data);

    } catch (error) {
      next(error)
    }
  }
}