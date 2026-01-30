import { Router } from "express";
import { JwtProvider } from "@/providers/implementations/JwtProvider.js";
import { makeEnsureAuthenticated } from "@/middlewares/ensureAuthenticatedMiddleware.js";
import { makeEnsureAuthorizedMiddleware } from "@/middlewares/ensureAuthorizedMiddleware.js";
import { ListPermissionsController } from "@/useCases/Permission/ListRoles/ListPermissionsController.js";

const permissionRoutes = Router();

const jwtProvider = new JwtProvider();
const ensureAuthenticatedMiddleware = makeEnsureAuthenticated(jwtProvider);
const requirePermission = (permission: string) =>
  makeEnsureAuthorizedMiddleware([permission]);

const listPermissionsController = new ListPermissionsController();

permissionRoutes.get(
  "/",
  ensureAuthenticatedMiddleware,
  requirePermission("permission:read"),
  (req, res, next) => listPermissionsController.handle(req, res, next)
);

export { permissionRoutes };
