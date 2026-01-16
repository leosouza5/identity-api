import type { IUserRepository } from "@/repositories/IUserRepository.js";
import type { ILoginRequestDTO } from "./ILoginDTO.js";

export class LoginUseCase {
  constructor(private userRepository: IUserRepository) {
    this.userRepository = userRepository
  }

  execute(data: ILoginRequestDTO) {
    
  }
}