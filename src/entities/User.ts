import { v4 as uuid } from 'uuid';

export type UserStatus = 'ACTIVE' | 'SUSPENDED';

type CreateUserProps = {
  name: string
  email: string
  passwordHash: string
  status?: UserStatus
}

type RestoreUserProps = {
  id: string
  name: string
  email: string
  passwordHash: string
  status: UserStatus
  lastLoginAt: Date | null
  createdAt: Date
  updatedAt: Date
}

export class User {
  public readonly id: string;
  public name: string;
  public email: string;
  public passwordHash: string;
  public status: UserStatus;

  public lastLoginAt?: Date | null;
  public createdAt?: Date;
  public updatedAt?: Date;

  private constructor(props: {
    id: string;
    name: string;
    email: string;
    passwordHash: string;
    status: UserStatus;
    lastLoginAt?: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = props.id
    this.name = props.name
    this.email = props.email
    this.passwordHash = props.passwordHash
    this.status = props.status
    this.lastLoginAt = props.lastLoginAt
    this.createdAt = props.createdAt
    this.updatedAt = props.updatedAt
  }

  static create(props: CreateUserProps) {
    const email = props.email.toLowerCase().trim();

    return new User({
      id: uuid(),
      name: props.name,
      email,
      passwordHash: props.passwordHash,
      status: props.status ?? 'ACTIVE',
      lastLoginAt: null,
    })
  }

  static restore(props: RestoreUserProps) {
    return new User({
      id: props.id,
      name: props.name,
      email: props.email,
      passwordHash: props.passwordHash,
      status: props.status,
      lastLoginAt: props.lastLoginAt,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    })
  }

  suspend() {
    this.status = 'SUSPENDED';
  }

  activate() {
    this.status = 'ACTIVE';
  }

  markLogin(at: Date = new Date()) {
    this.lastLoginAt = at
  }
}