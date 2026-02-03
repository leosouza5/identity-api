import type { IJwtProvider } from "@/providers/IJwtProvider.js";
import { AppError } from "@/utils/AppError.js";
import { Request, Response, NextFunction } from "express";

export function makeEnsureAuthenticated(jwtProvider: IJwtProvider) {

  return async function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
    const authorization = req.headers.authorization
    if (!authorization) {
      throw new AppError("Not Authorized", 403)
    }
  
    const [_, token] = authorization.split(' ')
    const { subject } = await jwtProvider.verify(token)
    req.userId = subject

    return next()
  }
} 
