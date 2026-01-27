import { Request, Response, NextFunction } from "express";
import type { ListPermissionsUseCase } from "./ListPermissionsUseCase.js";


export class ListPermissionsController {
  constructor(private listPermissionsUseCase: ListPermissionsUseCase) {
  }

  async handle(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.listPermissionsUseCase.execute();

      return res.status(200).json(data);

    } catch (error) {
      next(error)
    }
  }
}