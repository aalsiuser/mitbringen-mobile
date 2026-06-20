import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { getToken, api, listsApi, itemsApi, savingsApi, usersApi, type MeResponse } from './api'
import { signIn as apiSignIn, signUp as apiSignUp, signOut as apiSignOut } from './auth'
import type { Product, ListItem, ApiProduct } from './types'

type Phase = 'auth' | 'onboard-city' | 'onboard-name' | 'onboard-goal' | 'app'

interface User {
  id: number
  name: string | null
  email: string
  city: string | null
}

interface AppState {
  phase: Phase
  setPhase: (p: Phase) => void
  user: User | null
  signUp: (email: string, password: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (fields: { name?: string; email?: string }) => Promise<void>
  saveCity: (city: string) => Promise<void>
  saveListName: (name: string) => Promise<void>
  saveGoal: (goal: number | null) => Promise<void>
  currentListId: number | null
  listName: string
  setListName: (n: string) => void
  goal: number
  setGoal: (g: number) => void
  items: ListItem[]
  addItem: (product: ApiProduct) => Promise<void>
  addCustomItem: (name: string) => Promise<void>
  removeItem: (id: number) => Promise<void>
  saved: number
  shops: number
  justBanked: number
  bankSavings: (amount: number) => Promise<void>
  assistantOpen: boolean
  setAssistantOpen: (v: boolean) => void
}

const AppContext = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<Phase>('auth')
  const [user, setUser] = useState<User | null>(null)
  const [currentListId, setCurrentListId] = useState<number | null>(null)
  const [listName, setListName] = useState('Wocheneinkauf')
  const [goal, setGoal] = useState(50)
  const [items, setItems] = useState<ListItem[]>([])
  const [saved, setSaved] = useState(0)
  const [shops, setShops] = useState(0)
  const [justBanked, setJustBanked] = useState(0)
  const [assistantOpen, setAssistantOpen] = useState(false)

  const loadUserData = async () => {
    const [me, lists] = await Promise.all([usersApi.me(), listsApi.index()])
    setUser({ id: me.id, name: me.name, email: me.email, city: me.city })
    if (me.monthly_savings_goal) setGoal(Number(me.monthly_savings_goal))
    setSaved(me.saved_this_month)
    setShops(me.shops_this_month)
    if (lists.length > 0) {
      const list = lists[0]
      setCurrentListId(list.id)
      setListName(list.name)
      const listItems = await itemsApi.index(list.id)
      setItems(listItems)
    }
  }

  // Resume session
  useEffect(() => {
    getToken().then(async (token) => {
      if (!token) return
      try {
        setPhase('app')
        await loadUserData()
      } catch (e: any) {
        if (e.message === 'UNAUTHORIZED') setPhase('auth')
      }
    })
  }, [])

  // Load items when list changes
  useEffect(() => {
    if (!currentListId) return
    itemsApi.index(currentListId).then(setItems)
  }, [currentListId])

  const signUp = async (email: string, password: string) => {
    const u = await apiSignUp(email, password)
    setUser({ id: u.id, name: null, email: u.email, city: null })
    setPhase('onboard-city')
  }

  const signIn = async (email: string, password: string) => {
    await apiSignIn(email, password)
    setPhase('app')
    await loadUserData()
  }

  const updateProfile = async (fields: { name?: string; email?: string }) => {
    const me = await usersApi.update(fields)
    setUser({ id: me.id, name: me.name, email: me.email, city: me.city })
  }

  const saveCity = async (city: string) => {
    const me = await usersApi.update({ city })
    setUser({ id: me.id, name: me.name, email: me.email, city: me.city })
    setPhase('onboard-name')
  }

  const signOut = async () => {
    await apiSignOut()
    setUser(null)
    setCurrentListId(null)
    setItems([])
    setSaved(0)
    setShops(0)
    setPhase('auth')
  }

  const saveListName = async (name: string) => {
    const res = await listsApi.create(name)
    setCurrentListId(res.id)
    setListName(name)
    setPhase('onboard-goal')
  }

  const saveGoal = async (goal: number | null) => {
    if (goal) {
      await api.patch('/users/me', { user: { monthly_savings_goal: goal } })
      setGoal(goal)
    }
    setPhase('app')
  }

  const addItem = async (product: ApiProduct) => {
    if (!currentListId) return
    const name = product.display_name ?? product.name
    const item = await itemsApi.create(currentListId, name)
    setItems((xs) => (xs.find((x) => x.id === item.id) ? xs : [item, ...xs]))
  }

  const addCustomItem = async (name: string) => {
    if (!currentListId) return
    const item = await itemsApi.create(currentListId, name)
    setItems((xs) => (xs.find((x) => x.id === item.id) ? xs : [item, ...xs]))
  }

  const removeItem = async (id: number) => {
    if (!currentListId) return
    await itemsApi.destroy(currentListId, id)
    setItems((xs) => xs.filter((x) => x.id !== id))
  }

  const bankSavings = async (amount: number) => {
    await savingsApi.bank(amount)
    setSaved((s) => +(s + amount).toFixed(2))
    setShops((n) => n + 1)
    setJustBanked(+amount.toFixed(2))
    setItems([])
    setTimeout(() => setJustBanked(0), 2600)
  }

  return (
    <AppContext.Provider value={{
      phase, setPhase,
      user, signUp, signIn, signOut, updateProfile, saveCity,
      saveListName, saveGoal,
      currentListId,
      listName, setListName,
      goal, setGoal,
      items, addItem, addCustomItem, removeItem,
      saved, shops, justBanked, bankSavings,
      assistantOpen, setAssistantOpen,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
