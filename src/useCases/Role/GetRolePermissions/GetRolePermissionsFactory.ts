import { PostgresRoleRepository } from "@/repositories/implementations/PostgresRoleRepository.js";
import { GetRolePermissionsUseCase } from "./GetRolePermissionsUseCase.js";

export function makeGetRolePermissionsUseCase() {
  const roleRepository = new PostgresRoleRepository();

  return new GetRolePermissionsUseCase(roleRepository);
}
