import type { User } from "@/entities/User.js";

export interface IUserRepository {
  findById(userId: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  listRolesIdsByUserId(userId: string): Promise<string[]>
  save(user: User): Promise<void>
  syncUserRoles(userId: string, loggedUserId: string, rolesToAdd: string[], rolesToRemove: string[]): Promise<void>
}