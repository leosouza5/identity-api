import { PostgresAuditLogRepository } from "@/repositories/implementations/PostgresAuditLogRepository.js";
import { PostgresRoleRepository } from "@/repositories/implementations/PostgresRoleRepository.js";
import { UpdateRoleUseCase } from "./UpdateRoleUseCase.js";

export function makeUpdateRoleUseCase() {
  const roleRepository = new PostgresRoleRepository();
  const auditLogRepository = new PostgresAuditLogRepository();

  return new UpdateRoleUseCase(roleRepository, auditLogRepository);
}
