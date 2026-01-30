import { Request, Response, NextFunction } from "express";
import type {  ListRolesUseCase } from "./ListRolesUseCase.js";
import { makeListRolesUseCase } from "./ListRolesFactory.js";


export class ListRolesController {
  private listRolesUseCase: ListRolesUseCase;

  constructor() {
    this.listRolesUseCase = makeListRolesUseCase();
  }

  async handle(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.listRolesUseCase.execute();

      return res.status(200).json(data);

    } catch (error) {
      next(error);
    }
  }
}
