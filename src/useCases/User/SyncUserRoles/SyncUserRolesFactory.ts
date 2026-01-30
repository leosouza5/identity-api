import { PostgresAuditLogRepository } from "@/repositories/implementations/PostgresAuditLogRepository.js";
import { PostgresUserRepository } from "@/repositories/implementations/PostgresUserRepository.js";
import { SyncUserRolesUseCase } from "./SyncUserRolesUseCase.js";

export function makeSyncUserRolesUseCase() {
  const userRepository = new PostgresUserRepository();
  const auditLogRepository = new PostgresAuditLogRepository();

  return new SyncUserRolesUseCase(userRepository, auditLogRepository);
}
