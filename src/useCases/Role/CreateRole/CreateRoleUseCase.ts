import type { IRoleRepository } from "@/repositories/IRoleRepository.js"
import type { ICreateRoleDTO } from "./ICreateRoleDTO.js"
import { Role } from "@/entities/Role.js"

export class CreateRoleUseCase {
  constructor(private roleRepository: IRoleRepository) {
  }

  async execute(data: ICreateRoleDTO) {

    const role = new Role({name: data.name,description:data.description})

    return await this.roleRepository.create(role)
  }
}