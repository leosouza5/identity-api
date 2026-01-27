import { v4 as uuid } from "uuid"

export class Permission {
  public id?: string
  public key: string
  public description?: string
  public createdAt?: Date
  public updatedAt?: Date


  constructor(props: {
    id?: string
    key: string
    description?: string
    createdAt?: Date
    updatedAt?: Date
  }) {

    this.id = props.id ?? uuid()
    this.key = props.key
    this.description = props.description
    this.createdAt = props.createdAt 
    this.updatedAt = props.updatedAt
  }
}