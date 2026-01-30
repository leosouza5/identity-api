import { Router } from "express";
import { LoginController } from "@/useCases/Auth/Login/LoginController.js";
import { RefreshTokenController } from "@/useCases/Auth/RefreshToken/RefreshTokenController.js";

const authRoutes = Router();

const loginController = new LoginController();
const refreshTokenController = new RefreshTokenController();

authRoutes.post("/login", (req, res, next) =>
  loginController.handle(req, res, next)
);

authRoutes.post("/refresh", (req, res, next) =>
  refreshTokenController.handle(req, res, next)
);

export { authRoutes };
