import { AppError } from "@/utils/AppError";
import { Request, Response, NextFunction } from "express";

export function errorHandlingMiddleware (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
):Response  {
  console.log("to aq");
  
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message })
  }

 return  res.status(500).json({ message: "Internal server error" });
}

