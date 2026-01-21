export interface IPasswordHasherProvider {
  hash(password: string): Promise<string>
  compare(password: string, hash: string): Promise<boolean>
}