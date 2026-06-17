import { getItemAsync, setItemAsync, deleteItemAsync } from 'expo-secure-store'

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://192.168.0.160:3000/api/v1'
const TOKEN_KEY = 'auth_token'

export async function getToken() {
  return getItemAsync(TOKEN_KEY)
}

export async function saveToken(token: string) {
  await setItemAsync(TOKEN_KEY, token)
}

export async function clearToken() {
  await deleteItemAsync(TOKEN_KEY)
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = await getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(options.headers as Record<string, string>),
  }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers })

  if (res.status === 204) return undefined as T

  if (res.status === 401) {
    await deleteItemAsync(TOKEN_KEY)
    throw new Error('UNAUTHORIZED')
  }

  const body = await res.json()

  if (!res.ok) {
    const message = body?.errors?.join(', ') || body?.error || 'Something went wrong'
    throw new Error(message)
  }

  return body as T
}

export const api = {
  get: <T>(path: string) =>
    request<T>(path),
  post: <T>(path: string, data: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(data) }),
  patch: <T>(path: string, data: unknown) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: <T>(path: string) =>
    request<T>(path, { method: 'DELETE' }),
}

import type { ApiProduct, ListItem, ShoppingList } from './types'

export const productsApi = {
  search: (q: string) =>
    api.get<ApiProduct[]>(`/products?q=${encodeURIComponent(q)}`),
}

export const listsApi = {
  index: () => api.get<ShoppingList[]>('/shopping_lists'),
  create: (name: string) =>
    api.post<ShoppingList>('/shopping_lists', { shopping_list: { name } }),
}

export const savingsApi = {
  bank: (amount: number) =>
    api.post<{ id: number; amount: number }>('/savings', { amount }),
}

export type MeResponse = {
  id: number
  name: string | null
  email: string
  monthly_savings_goal: number | null
  saved_this_month: number
  shops_this_month: number
}

export const usersApi = {
  me: () => api.get<MeResponse>('/users/me'),
  update: (fields: Partial<Pick<MeResponse, 'name' | 'email' | 'monthly_savings_goal'>>) =>
    api.patch<MeResponse>('/users/me', { user: fields }),
}

export const itemsApi = {
  index: (listId: number) =>
    api.get<ListItem[]>(`/shopping_lists/${listId}/items`),
  create: (listId: number, name: string) =>
    api.post<ListItem>(`/shopping_lists/${listId}/items`, { shopping_list_item: { name } }),
  destroy: (listId: number, itemId: number) =>
    api.delete<void>(`/shopping_lists/${listId}/items/${itemId}`),
}
