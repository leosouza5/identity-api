import { AppError } from "@/utils/AppError.js";
import crypto from "crypto"
import type { IRefreshTokenHasherProvider } from "../IRefreshTokenHasherProvider.js";
export class RefreshTokenHasherProvider implements IRefreshTokenHasherProvider {
  private readonly secret: string

  constructor() {
    if (!process.env.REFRESH_TOKEN_SECRET) {
      throw new AppError("Refresh Token Secret is not defined")
    }
    this.secret = process.env.REFRESH_TOKEN_SECRET
  }

  async hash(refreshToken: string): Promise<string> {
    return crypto.
    createHmac("sha256", this.secret)
    .update(refreshToken)
    .digest('hex')
  }
}