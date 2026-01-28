import { Request, Response, NextFunction } from "express";
import { PasswordHasherProvider } from "@/providers/implementations/PasswordHasherProvider.js";
import { PostgresUserRepository } from "@/repositories/implementations/PostgresUserRepository.js";
import { CreateUserController } from "@/useCases/User/CreateUser/CreateUserController.js";
import { CreateUserUseCase } from "@/useCases/User/CreateUser/CreateUserUseCase.js";
import { Router } from "express";
import { makeEnsureAuthenticated } from "@/middlewares/ensureAuthenticatedMiddleware.js";
import { JwtProvider } from "@/providers/implementations/JwtProvider.js";
import { makeEnsureAuthorized } from "@/middlewares/ensureAuthorizedMiddleware.js";
import { PostgresAuthorizationRepository } from "@/repositories/implementations/PostgresAuthorizationRepository.js";
import { EnsureAuthorizedUseCase } from "@/useCases/Authorization/EnsureAuthorized/EnsureAuthorizedUseCase.js";


const userRoutes = Router();

const postgresAuthorizationRepository = new PostgresAuthorizationRepository();
const postgresUserRepository = new PostgresUserRepository();
const passwordHasher = new PasswordHasherProvider();
const jwtProvider = new JwtProvider()

const ensureAuthorizedUseCase = new EnsureAuthorizedUseCase(
  postgresUserRepository,
  postgresAuthorizationRepository
);
const createUserUseCase = new CreateUserUseCase(postgresUserRepository, passwordHasher);
const createUserController = new CreateUserController(createUserUseCase);

const ensureAuthenticatedMiddleware = makeEnsureAuthenticated(jwtProvider)

const requirePermission = (...permissions: string[]) =>
  makeEnsureAuthorized(permissions, ensureAuthorizedUseCase);


userRoutes.post("/",
   ensureAuthenticatedMiddleware, 
   requirePermission("user:create"), 
   (req, res, next) => createUserController.handle(req, res, next)
)


export { userRoutes }