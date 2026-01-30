import { Router } from "express";
import { JwtProvider } from "@/providers/implementations/JwtProvider.js";
import { makeEnsureAuthenticated } from "@/middlewares/ensureAuthenticatedMiddleware.js";
import { makeEnsureAuthorizedMiddleware } from "@/middlewares/ensureAuthorizedMiddleware.js";
import { CreateRoleController } from "@/useCases/Role/CreateRole/CreateRoleController.js";
import { UpdateRoleController } from "@/useCases/Role/UpdateRole/UpdateRoleController.js";
import { DeleteRoleController } from "@/useCases/Role/DeleteRole/DeleteRoleController.js";
import { ListRolesController } from "@/useCases/Role/ListRoles/ListRolesController.js";
import { GetRolePermissionsController } from "@/useCases/Role/GetRolePermissions/GetRolePermissionsController.js";
import { SyncRolePermissionsController } from "@/useCases/Role/SyncRolePermissions/SyncRolePermissionsController.js";

const roleRoutes = Router();

const jwtProvider = new JwtProvider();
const ensureAuthenticatedMiddleware = makeEnsureAuthenticated(jwtProvider);
const requirePermission = (permission: string) =>
  makeEnsureAuthorizedMiddleware([permission]);

const createRoleController = new CreateRoleController();
const updateRoleController = new UpdateRoleController();
const deleteRoleController = new DeleteRoleController();
const listRolesController = new ListRolesController();
const getRolePermissionsController = new GetRolePermissionsController();
const syncRolePermissionsController = new SyncRolePermissionsController();

roleRoutes.get(
  "/",
  ensureAuthenticatedMiddleware,
  requirePermission("role:read"),
  (req, res, next) => listRolesController.handle(req, res, next)
);

roleRoutes.get(
  "/permissions",
  ensureAuthenticatedMiddleware,
  requirePermission("role:read"),
  (req, res, next) => getRolePermissionsController.handle(req, res, next)
);

roleRoutes.post(
  "/",
  ensureAuthenticatedMiddleware,
  requirePermission("role:create"),
  (req, res, next) => createRoleController.handle(req, res, next)
);

roleRoutes.put(
  "/:role_id",
  ensureAuthenticatedMiddleware,
  requirePermission("role:update"),
  (req, res, next) => updateRoleController.handle(req, res, next)
);

roleRoutes.delete(
  "/:role_id",
  ensureAuthenticatedMiddleware,
  requirePermission("role:delete"),
  (req, res, next) => deleteRoleController.handle(req, res, next)
);

roleRoutes.post(
  "/:role_id/sync-permissions",
  ensureAuthenticatedMiddleware,
  requirePermission("role:sync_permissions"),
  (req, res, next) => syncRolePermissionsController.handle(req, res, next)
);

export { roleRoutes };
