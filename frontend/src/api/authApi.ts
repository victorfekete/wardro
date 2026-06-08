import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from "../types/Auth"

const API_URL = "http://localhost:8080/api"

export async function login(
  loginRequest: LoginRequest
): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginRequest),
  })

  if (!response.ok) {
    throw new Error("Failed to login")
  }

  return response.json()
}

export async function register(
  registerRequest: RegisterRequest
): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(registerRequest),
  })

  if (!response.ok) {
    throw new Error("Failed to register")
  }

  return response.json()
}