import { PasswordHasherProvider } from "@/providers/implementations/PasswordHasherProvider.js";
import { PostgresAuditLogRepository } from "@/repositories/implementations/PostgresAuditLogRepository.js";
import { PostgresUserRepository } from "@/repositories/implementations/PostgresUserRepository.js";
import { CreateUserUseCase } from "./CreateUserUseCase.js";

export function makeCreateUserUseCase() {
  const userRepository = new PostgresUserRepository();
  const auditLogRepository = new PostgresAuditLogRepository();
  const passwordHasher = new PasswordHasherProvider();

  return new CreateUserUseCase(userRepository, passwordHasher, auditLogRepository);
}
