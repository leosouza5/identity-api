import { Router } from "express";
import { authRoutes } from "@/routes/authRoutes.js";
import { permissionRoutes } from "@/routes/permissionRoutes.js";
import { roleRoutes } from "@/routes/roleRoutes.js";
import { userRoutes } from "@/routes/userRoutes.js";

const routes = Router();

routes.get("/health", (_req, res) => res.status(200).json({ status: "ok" }));

routes.use("/auth", authRoutes);
routes.use("/users", userRoutes);
routes.use("/roles", roleRoutes);
routes.use("/permissions", permissionRoutes);

export { routes };
