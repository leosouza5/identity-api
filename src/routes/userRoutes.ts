import { Request, Response, NextFunction } from "express";
import { PasswordHasherProvider } from "@/providers/implementations/PasswordHasherProvider.js";
import { PostgresUserRepository } from "@/repositories/implementations/PostgresUserRepository.js";
import { CreateUserController } from "@/useCases/CreateUser/CreateUserController.js";
import { CreateUserUseCase } from "@/useCases/CreateUser/CreateUserUseCase.js";
import { Router } from "express";


const userRoutes = Router();

const postgresUserRepository = new PostgresUserRepository();
const passwordHasher = new PasswordHasherProvider();

const createUserUseCase = new CreateUserUseCase(postgresUserRepository, passwordHasher);
const createUserController = new CreateUserController(createUserUseCase);


userRoutes.post("/", (req: Request, res: Response, next: NextFunction) => {
  return createUserController.handle(req, res, next)
})


export {userRoutes}