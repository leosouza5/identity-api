
import type { IUserRepository } from "@/repositories/IUserRepository.js";
import { AppError } from "@/utils/AppError.js";
import type { IEnsureAuthorizedDTO } from "./IEnsureAuthorizedDTO.js";
import type { IAuthorizationRepository } from "@/repositories/IAuthorizationRepository.js";

export class EnsureAuthorizedUseCase {
  constructor(
    private userRepository: IUserRepository,
    private authorizationRepository: IAuthorizationRepository,
  ) {
  }

  async execute(data: IEnsureAuthorizedDTO) {

    const user = await this.userRepository.findById(data.userId)

    if (!user) {
      throw new AppError("Not authorized", 403)
    }

    const userPermissions = await this.authorizationRepository.getPermissionsByUserId(user.id)

    const currentPermissionKeys = new Set(userPermissions.map(perm => perm.key))

    if (!data.permissions.some(perm => currentPermissionKeys.has(perm))){
      throw new AppError("Not authorized", 403)
    }
  }
}