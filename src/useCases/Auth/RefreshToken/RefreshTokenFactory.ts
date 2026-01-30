import { JwtProvider } from "@/providers/implementations/JwtProvider.js";
import { RefreshTokenHasherProvider } from "@/providers/implementations/RefreshTokenHasherProvider.js";
import { PostgresRefreshTokenRepository } from "@/repositories/implementations/PostgresRefreshTokenRepository.js";
import { RefreshTokenUseCase } from "./RefreshTokenUseCase.js";

export function makeRefreshTokenUseCase() {
  const refreshTokenRepository = new PostgresRefreshTokenRepository();
  const refreshTokenHasherProvider = new RefreshTokenHasherProvider();
  const jwtProvider = new JwtProvider();

  return new RefreshTokenUseCase(refreshTokenRepository, refreshTokenHasherProvider, jwtProvider);
}
