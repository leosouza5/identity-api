import { PostgresAuditLogRepository } from "@/repositories/implementations/PostgresAuditLogRepository.js";
import { PostgresRoleRepository } from "@/repositories/implementations/PostgresRoleRepository.js";
import { SyncRolePermissionsUseCase } from "./SyncRolePermissionsUseCase.js";

export function makeSyncRolePermissionsUseCase() {
  const roleRepository = new PostgresRoleRepository();
  const auditLogRepository = new PostgresAuditLogRepository();

  return new SyncRolePermissionsUseCase(roleRepository, auditLogRepository);
}
