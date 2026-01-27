import type { Permission } from "@/entities/Permission.js";
import type { Role } from "@/entities/Role.js";

export interface UpdateRoleData {
  name?: string
  description?: string
}

export interface IRoleRepository {
  getAll(): Promise<Role[] | undefined>
  getById(id: string): Promise<Role | undefined>
  create(role: Role): Promise<void>
  update(id: string, updateRoleData: UpdateRoleData): Promise<void>
  delete(roleId: string): Promise<void>

  listPermissionsIds(roleId: string): Promise<string[]>
  listPermissions(roleId: string): Promise<Permission[]>
  syncRolePermissions(roleId: string, permissionsToAdd: string[], permissionsToRemove: string[], userId: string): Promise<void>
}