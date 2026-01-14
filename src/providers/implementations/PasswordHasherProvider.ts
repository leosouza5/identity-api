import type { IPasswordHasher } from "../IPasswordHasher.js";
import argon2 from 'argon2';
export class PasswordHasherProvider implements IPasswordHasher{

  async hash(password :string) : Promise<string> {
    return await argon2.hash(password);
  } 
}