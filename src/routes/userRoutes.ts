import { CreateUserController } from "@/useCases/User/CreateUser/CreateUserController.js";
import { Router } from "express";
import { makeEnsureAuthenticated } from "@/middlewares/ensureAuthenticatedMiddleware.js";
import { JwtProvider } from "@/providers/implementations/JwtProvider.js";
import { makeEnsureAuthorizedMiddleware } from "@/middlewares/ensureAuthorizedMiddleware.js";
import { SyncUserRolesController } from "@/useCases/User/SyncUserRoles/SyncUserRolesController.js";
const userRoutes = Router();

const jwtProvider = new JwtProvider();

const createUserController = new CreateUserController();
const syncUserRolesController = new SyncUserRolesController();

const ensureAuthenticatedMiddleware = makeEnsureAuthenticated(jwtProvider);
const requirePermission = (permission: string) =>
  makeEnsureAuthorizedMiddleware([permission]);




userRoutes.post("/",
  ensureAuthenticatedMiddleware,
  requirePermission("user:create"),
  (req, res, next) => createUserController.handle(req, res, next)
)


userRoutes.post("/:user_id/sync-roles",
  ensureAuthenticatedMiddleware,
  requirePermission("role:assign"),
  (req, res, next) => syncUserRolesController.handle(req, res, next)
)


export { userRoutes }
