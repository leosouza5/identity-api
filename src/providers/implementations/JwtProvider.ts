import jwt from "jsonwebtoken";

import type { IJwtProvider, JwtSignInput, JwtVerifyResult } from "../IJwtProvider.js";
import { authConfig } from "@/config/auth.js";

export class JwtProvider implements IJwtProvider {
  async generateToken(input: JwtSignInput): Promise<string> {
    const token = jwt.sign(input.payload ?? {}, authConfig.jwt.secret, { expiresIn: authConfig.jwt.expiresIn, subject: input.subject })
    
    return token
  }

  async verify(token: string): Promise<JwtVerifyResult> {
    const decoded = jwt.verify(token, authConfig.jwt.secret!)

    if (typeof decoded === "string") {
      return { subject: decoded, payload: {} }
    }

    const { sub, ...payload } = decoded

    return {
      subject: typeof sub === "string" ? sub : (decoded as any).subject ?? "",
      payload: payload as Record<string, any>
    }
  }
}
