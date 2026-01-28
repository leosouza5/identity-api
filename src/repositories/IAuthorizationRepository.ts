import { Permission } from "@/entities/Permission.js";

export interface IAuthorizationRepository {
  getPermissionsByUserId(userId:string): Promise<Permission[]>
}

