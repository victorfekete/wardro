import type { AuthResponse, AuthUser } from "../types/Auth"

const TOKEN_KEY = "wardro_token"
const USER_KEY = "wardro_user"

export function saveAuthData(authResponse: AuthResponse) {
  localStorage.setItem(TOKEN_KEY, authResponse.token)

  const user: AuthUser = {
    userId: authResponse.userId,
    fullName: authResponse.fullName,
    email: authResponse.email,
    role: authResponse.role,
  }

  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function getAuthUser(): AuthUser | null {
  const storedUser = localStorage.getItem(USER_KEY)

  if (!storedUser) {
    return null
  }

  try {
    return JSON.parse(storedUser)
  } catch {
    return null
  }
}

export function isAuthenticated(): boolean {
  return getAuthToken() !== null
}

export function isAdmin(): boolean {
  return getAuthUser()?.role === "ADMIN"
}

export function clearAuthData() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}