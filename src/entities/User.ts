import { v4 as uuid } from 'uuid';

export type UserStatus = 'ACTIVE' | 'SUSPENDED';

export class User {
  public readonly id: string;
  public name: string;
  public email: string;
  public passwordHash: string;
  public status: UserStatus;

  public lastLoginAt?: Date | null;
  public createdAt?: Date;
  public updatedAt?: Date;

   constructor(props: {
    id?: string;
    name: string;
    email: string;
    passwordHash: string;
    status?: UserStatus;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = props.id ?? uuid()
    this.name = props.name
    this.email = props.email
    this.passwordHash = props.passwordHash
    this.status = props.status ?? 'ACTIVE'
    this.createdAt = props.createdAt
    this.updatedAt = props.updatedAt
  }


  suspend() {
    this.status = 'SUSPENDED';
  }

  activate() {
    this.status = 'ACTIVE';
  }

  markLogin(at: Date = new Date()) {
  }
}