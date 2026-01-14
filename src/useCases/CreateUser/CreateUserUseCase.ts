import type { IUserRepository } from "@/repositories/IUserRepository.js"
import type { ICreateUserRequestDTO } from "./ICreateUserDTO.js"
import { AppError } from "@/utils/AppError.js"
import { User } from "@/entities/User.js"
import type { IPasswordHasher } from "@/providers/IPasswordHasher.js"

export class CreateUserUseCase {
  constructor(private userRepository: IUserRepository, private passwordHasher: IPasswordHasher) {
  }

  async execute(data: ICreateUserRequestDTO) {
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

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      status: user.status,
    }
  }
}