export type Role = "USER" | "ADMIN"

export type AuthUser = {
  userId: number
  fullName: string
  email: string
  role: Role
}

export type AuthResponse = {
  token: string
  userId: number
  fullName: string
  email: string
  role: Role
}

export type LoginRequest = {
  email: string
  password: string
}

export type RegisterRequest = {
  fullName: string
  email: string
  password: string
}