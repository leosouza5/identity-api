import  { Permission } from "@/entities/Permission.js";

export interface IPermissionRepository {
  getAll(): Promise<Permission[]>
  create(permission: Permission): Promise<void>
}

//fiz os repositories mas n fiz os useCases