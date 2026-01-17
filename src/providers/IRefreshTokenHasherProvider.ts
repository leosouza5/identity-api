export interface IRefreshTokenHasherProvider {
  hash(refreshToken: string): Promise<string>
}