import type { EnsureAuthorizedUseCase } from "@/useCases/Authorization/EnsureAuthorized/EnsureAuthorizedUseCase.js";
import { AppError } from "@/utils/AppError.js";
import type { NextFunction, Request, Response } from "express"
import { makeEnsureAuthorizedUseCase } from "@/useCases/Authorization/EnsureAuthorized/EnsureAuthorizedFactory.js";

export function makeEnsureAuthorized(
  permissions: string[],
  ensureAuthorizedUseCase: EnsureAuthorizedUseCase
) {
  return async function ensureAuthorized(req: Request, _res: Response, next: NextFunction) {
    try {
      const userId = req.userId;
      if (!userId) return next(new AppError("Not Authorized", 403));

      await ensureAuthorizedUseCase.execute({ permissions, userId });
      return next();
    } catch (error) {
      return next(error);
    }
  };
}

export function makeEnsureAuthorizedMiddleware(permissions: string[]) {
  const ensureAuthorizedUseCase = makeEnsureAuthorizedUseCase();
  return makeEnsureAuthorized(permissions, ensureAuthorizedUseCase);
}
