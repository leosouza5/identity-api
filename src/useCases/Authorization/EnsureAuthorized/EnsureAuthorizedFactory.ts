import { PostgresAuthorizationRepository } from "@/repositories/implementations/PostgresAuthorizationRepository.js";
import { PostgresUserRepository } from "@/repositories/implementations/PostgresUserRepository.js";
import { EnsureAuthorizedUseCase } from "./EnsureAuthorizedUseCase.js";

export function makeEnsureAuthorizedUseCase() {
  const userRepository = new PostgresUserRepository();
  const authorizationRepository = new PostgresAuthorizationRepository();

  return new EnsureAuthorizedUseCase(userRepository, authorizationRepository);
}
