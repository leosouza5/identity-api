import { PostgresPermissionRepository } from "@/repositories/implementations/PostgresPermissionRepository.js";
import { ListPermissionsUseCase } from "./ListPermissionsUseCase.js";

export function makeListPermissionsUseCase() {
  const permissionRepository = new PostgresPermissionRepository();

  return new ListPermissionsUseCase(permissionRepository);
}
