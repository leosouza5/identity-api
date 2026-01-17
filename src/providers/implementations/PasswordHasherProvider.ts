import type { IPasswordHasherProvider } from "../IPasswordHasherProvider.js";
import argon2 from 'argon2';
export class PasswordHasherProvider implements IPasswordHasherProvider{

  async hash(password :string) : Promise<string> {
    return await argon2.hash(password);
  } 
}