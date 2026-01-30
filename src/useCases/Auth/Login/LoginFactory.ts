import { JwtProvider } from "@/providers/implementations/JwtProvider.js";
import { PasswordHasherProvider } from "@/providers/implementations/PasswordHasherProvider.js";
import { RefreshTokenHasherProvider } from "@/providers/implementations/RefreshTokenHasherProvider.js";
import { PostgresRefreshTokenRepository } from "@/repositories/implementations/PostgresRefreshTokenRepository.js";
import { PostgresUserRepository } from "@/repositories/implementations/PostgresUserRepository.js";
import { LoginUseCase } from "./LoginUseCase.js";

export function makeLoginUseCase() {
  const refreshTokenHasherProvider = new RefreshTokenHasherProvider();
  const jwtProvider = new JwtProvider();
  const userRepository = new PostgresUserRepository();
  const refreshTokenRepository = new PostgresRefreshTokenRepository();
  const passwordHasherProvider = new PasswordHasherProvider();

  return new LoginUseCase(
    refreshTokenHasherProvider,
    jwtProvider,
    userRepository,
    refreshTokenRepository,
    passwordHasherProvider
  );
}
