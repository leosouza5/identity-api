import { v4 as uuid } from "uuid"

export class RefreshToken {
  public id?: string
  public userId: string
  public tokenHash: string

  public expiresAt: Date
  public revokedAt?: Date | null
  public createdAt: Date

  constructor(props: {
    id?: string
    userId: string
    tokenHash: string
    expiresAt: Date
    revokedAt?: Date | null
    createdAt: Date
  }) {
    this.id = props.id ?? uuid()
    this.userId = props.userId
    this.tokenHash = props.tokenHash
    this.expiresAt = props.expiresAt
    this.revokedAt = props.revokedAt
    this.createdAt = props.createdAt
  }
}