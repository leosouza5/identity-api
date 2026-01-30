import { Request, Response, NextFunction } from "express";
import type { RefreshTokenUseCase } from "./RefreshTokenUseCase.js";
import { makeRefreshTokenUseCase } from "./RefreshTokenFactory.js";
import { refreshTokenSchema } from "@/schemas/refreshTokenSchema.js";

export class RefreshTokenController {
  private refreshTokenUseCase: RefreshTokenUseCase;

  constructor() {
    this.refreshTokenUseCase = makeRefreshTokenUseCase();
  }

  async handle(req: Request, res: Response, next: NextFunction) {
    try {
      const safeValues = refreshTokenSchema.parse(req.body);
      const accessToken = await this.refreshTokenUseCase.exec(
        safeValues,
        req.userId ?? ""
      );

      return res.status(200).json({ accessToken });
    } catch (error) {
      next(error);
    }
  }
}
