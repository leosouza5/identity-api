import { PostgresAuditLogRepository } from "@/repositories/implementations/PostgresAuditLogRepository.js";
import { PostgresRoleRepository } from "@/repositories/implementations/PostgresRoleRepository.js";
import { CreateRoleUseCase } from "./CreateRoleUseCase.js";

export function makeCreateRoleUseCase() {
  const roleRepository = new PostgresRoleRepository();
  const auditLogRepository = new PostgresAuditLogRepository();

  return new CreateRoleUseCase(roleRepository, auditLogRepository);
}
