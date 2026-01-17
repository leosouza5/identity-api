
export type JwtSignInput = {
  subject: string
  payload?: Record<string, any>
  expiresIn?: string | number
}

export type JwtVerifyResult = {
  subject: string
  payload: Record<string, any>
}

export interface IJwtProvider {
  generateToken(input: JwtSignInput): Promise<string>
  verify(token: string): Promise<JwtVerifyResult>
}