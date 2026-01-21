import crypto from "crypto"


import type { IUserRepository } from "@/repositories/IUserRepository.js";
import type { ILoginRequestDTO } from "./ILoginDTO.js";
import type { IRefreshTokenRepository } from "@/repositories/IRefreshTokenRepository.js";
import { AppError } from "@/utils/AppError.js";
import type { IPasswordHasherProvider } from "@/providers/IPasswordHasherProvider.js";
import type { IJwtProvider } from "@/providers/IJwtProvider.js";
import { RefreshToken } from "@/entities/RefreshToken.js";
import type { IRefreshTokenHasherProvider } from "@/providers/IRefreshTokenHasherProvider.js";

export class LoginUseCase {
  constructor(
    private refreshTokenHasherProvider: IRefreshTokenHasherProvider,
    private jwtProvider: IJwtProvider,
    private userRepository: IUserRepository,
    private refreshTokenRepository: IRefreshTokenRepository,
    private passwordHasherProvider: IPasswordHasherProvider) {
  }

  async execute(data: ILoginRequestDTO) {
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)
    
    const user = await this.userRepository.findByEmail(data.email)
    if (!user) {
      throw new AppError("Incorrect Credentials", 401)
    }

    const passwordMatches = await this.passwordHasherProvider.compare(data.password, user.passwordHash)
    if (!passwordMatches) {
      throw new AppError("Incorrect Credentials", 401)
    }
  
    const plainHash = crypto.randomBytes(64).toString("hex")
    const refreshTokenHash = await this.refreshTokenHasherProvider.hash(plainHash)


    const refreshToken = new RefreshToken({ expiresAt, tokenHash: refreshTokenHash, userId: user.id })
    const jwt = await this.jwtProvider.generateToken({ subject: user.id })

    try {
      await this.refreshTokenRepository.save(refreshToken)
    } catch (error) {
      throw new AppError("Server Error")
    }

    return {
      accessToken: jwt,
      refreshToken: plainHash
    }
  }
}