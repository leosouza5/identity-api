import { Request, Response, NextFunction } from "express";
import type { LoginUseCase } from "./LoginUseCase.js";
import { makeLoginUseCase } from "./LoginFactory.js";
import { loginSchema } from "@/schemas/loginSchema.js";

export class LoginController {
  private loginUseCase: LoginUseCase;

  constructor() {
    this.loginUseCase = makeLoginUseCase();
  }

  async handle(req: Request, res: Response, next: NextFunction) {
    try {
      const safeValues = loginSchema.parse(req.body);
      const data = await this.loginUseCase.execute(safeValues);

      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
}
