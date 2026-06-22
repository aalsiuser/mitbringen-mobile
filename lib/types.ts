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
export interface GratisDeal {
  label: string             // "3+3", "2+1", "ab 4"
  unit_name: string         // "Fl.", "Dose", "Stück"
  single: number            // single-buy price (€8.99)
  bulk_price: number        // per-unit price when threshold met (€4.49)
  min_qty: number           // minimum quantity to unlock bulk price
  note: string | null       // parenthetical terms, e.g. "keine weiteren Rabatte"
}

export interface ApiProduct {
  supermarket: string
  supermarket_name: string
  name: string                      // raw extracted flyer text
  display_name: string | null       // cleaned, user-facing
  brand: string | null              // brand if any
  category: string | null           // fixed enum (wine / milk / bread-bakery / ...)
  promo_price: number | null
  regular_price: number | null
  unit: string | null
  valid_from: string | null
  valid_to: string | null
  image_key: string | null          // curated enum key the LLM picked (or null when no match)
  image_file: string | null         // icon filename slug, always populated — maps to PRODUCT_ICONS in lib/productIcons.ts
  gratis: GratisDeal | null
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
