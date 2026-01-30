import { PostgresRoleRepository } from "@/repositories/implementations/PostgresRoleRepository.js";
import { ListRolesUseCase } from "./ListRolesUseCase.js";

export function makeListRolesUseCase() {
  const roleRepository = new PostgresRoleRepository();

  return new ListRolesUseCase(roleRepository);
}
