import { Request, Response, NextFunction } from "express";
import type {  ListRolesUseCase } from "./ListRolesUseCase.js";


export class ListRolesController {
  constructor(private listRolesUseCase: ListRolesUseCase) {
  }

  async handle(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.listRolesUseCase.execute();

      return res.status(200).json(data);

    } catch (error) {
      next(error)
    }
  }
}