import { Request, Response, NextFunction } from "express";
import { PasswordHasherProvider } from "@/providers/implementations/PasswordHasherProvider.js";
import { PostgresUserRepository } from "@/repositories/implementations/PostgresUserRepository.js";
import { CreateUserController } from "@/useCases/User/CreateUser/CreateUserController.js";
import { CreateUserUseCase } from "@/useCases/User/CreateUser/CreateUserUseCase.js";
import { Router } from "express";
import { makeEnsureAuthenticated } from "@/middlewares/ensureAuthenticatedMiddleware.js";
import { JwtProvider } from "@/providers/implementations/JwtProvider.js";


const userRoutes = Router();

const postgresUserRepository = new PostgresUserRepository();
const passwordHasher = new PasswordHasherProvider();
const jwtProvider = new JwtProvider()

const createUserUseCase = new CreateUserUseCase(postgresUserRepository, passwordHasher);
const createUserController = new CreateUserController(createUserUseCase);

const ensureAuthenticatedMiddleware = makeEnsureAuthenticated(jwtProvider)

userRoutes.post("/", ensureAuthenticatedMiddleware, (req: Request, res: Response, next: NextFunction) => {
  return createUserController.handle(req, res, next)
},)


export { userRoutes }