import { PostgresAuditLogRepository } from "@/repositories/implementations/PostgresAuditLogRepository.js";
import { PostgresRoleRepository } from "@/repositories/implementations/PostgresRoleRepository.js";
import { DeleteRoleUseCase } from "./DeleteRoleUseCase.js";

export function makeDeleteRoleUseCase() {
  const roleRepository = new PostgresRoleRepository();
  const auditLogRepository = new PostgresAuditLogRepository();

  return new DeleteRoleUseCase(roleRepository, auditLogRepository);
}
