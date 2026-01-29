import type { IUserRepository } from "@/repositories/IUserRepository.js"
import type { ICreateUserRequestDTO } from "./ICreateUserDTO.js"
import { AppError } from "@/utils/AppError.js"
import { User } from "@/entities/User.js"
import type { IPasswordHasherProvider } from "@/providers/IPasswordHasherProvider.js"
import type { IAuditLogRepository } from "@/repositories/IAuditLogRepository.js"

export class CreateUserUseCase {
  constructor(private userRepository: IUserRepository, private passwordHasher: IPasswordHasherProvider, private auditLogRepository: IAuditLogRepository) {
  }

  async execute(data: ICreateUserRequestDTO, auditData: AuditCtx) {
    const userAlreadyExists = await this.userRepository.findByEmail(data.email)

    if (userAlreadyExists) {
      throw new AppError('User already exists.')
    }

    const hashedPassword = await this.passwordHasher.hash(data.password)

    const user = new User({
      name: data.name,
      email: data.email,
      passwordHash: hashedPassword,
    })


    await this.userRepository.save(user)
    try {
      await this.auditLogRepository.create({
        action: 'user:create',
        resourceId: user.id,
        resourceType: 'User',
        actorUserId: auditData.actorUserId,
        ipAddress: auditData.ipAddress,
        userAgent: auditData.userAgent,
        metadata: {
          name: data.name,
          email: data.email,
        }
      })
    } catch { }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      status: user.status,
    }
  }
}