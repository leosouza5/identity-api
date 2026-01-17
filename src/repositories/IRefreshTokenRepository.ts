import type { RefreshToken } from "@/entities/RefreshToken.js";

export interface IRefreshTokenRepository {
  findByHash(hash:string): Promise<RefreshToken | null>
  save(refreshToken: RefreshToken): Promise<void>
  revokeById(id:string):Promise<void>
}