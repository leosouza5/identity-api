import { v4 as uuid } from "uuid"

export class Role {
  public id?: string
  public name: string
  public description?: string
  public createdAt?: Date
  public updatedAt?: Date


  constructor(props: {
    id?: string
    name: string
    description?: string
    createdAt?: Date
    updatedAt?: Date
  }) {

    this.id = props.id ?? uuid()
    this.name = props.name
    this.description = props.description
    this.createdAt = props.createdAt 
    this.updatedAt = props.updatedAt
  }
}