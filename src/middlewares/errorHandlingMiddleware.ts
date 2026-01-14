import { AppError } from "@/utils/AppError.js";
import { Request, Response, NextFunction } from "express";
import z, { ZodError } from "zod";

export function errorHandlingMiddleware (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
):Response  {
  
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message })
  }

  if (err instanceof ZodError){
    return res.status(400).json({ message: "Validation Error", issues: z.treeifyError(err) })
  }

 return  res.status(500).json({ message: "Internal server error" ,error: err.message});
}

