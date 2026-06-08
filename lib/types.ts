export type AuthMode = 'signup' | 'login'

export interface Store {
  id: string
  name: string
  address: string
  area: string
  walk: string
  color: string
}

// Legacy mock type — used by store-rec screen only
export interface Product {
  id: string
  name: string
  unit: string
  cat: string
  regular: number
  promo: number
  store: string
  emoji: string
}

export interface BasketStop {
  store: Store
  items: Product[]
  saving: number
  spend: number
}

export interface BasketPlan {
  stops: BasketStop[]
  leftover: Product[]
  totalSaving: number
  totalSpend: number
  covered: number
}

// Real API types
export interface ApiProduct {
  supermarket: string
  supermarket_name: string
  name: string
  promo_price: number | null
  regular_price: number | null
  unit: string | null
  valid_from: string | null
  valid_to: string | null
}

export interface ListItem {
  id: number
  name: string
  quantity: string | null
  unit: string | null
  notes: string | null
  created_at: string
  best_price: ApiProduct | null
}

export interface ShoppingList {
  id: number
  name: string
  status: string | null
  created_at: string
  item_count: number
}
