import { api, saveToken, clearToken } from './api'

interface AuthResponse {
  user: { id: number; email: string }
  token: string
}

interface SignUpResponse {
  user: { id: number; email: string; created_at: string }
}

export async function signUp(email: string, password: string) {
  await api.post<SignUpResponse>('/users', {
    user: { email, password, password_confirmation: password },
  })
  // Sign in immediately to get the JWT
  return signIn(email, password)
}

export async function signIn(email: string, password: string) {
  const res = await api.post<AuthResponse>('/users/sign_in', {
    user: { email, password },
  })
  await saveToken(res.token)
  return res.user
}

export async function signOut() {
  try {
    await api.delete('/users/sign_out')
  } finally {
    await clearToken()
  }
}
