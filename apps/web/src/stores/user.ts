import { createStore, type StoreApi } from 'zustand/vanilla'
import { useStore } from 'zustand'
import type { User } from '@/types/user'

export interface UserState {
  user: User | null | undefined
  setUser: (user: User) => void
  logoutUser: () => void
}

export const createUserStore = (preloadedState?: Partial<UserState>): StoreApi<UserState> =>
  createStore<UserState>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    logoutUser: () => set({ user: null }),
    ...preloadedState,
  }))

let clientStore: StoreApi<UserState> | null = null

export const initializeUserStore = (preloadedState?: Partial<UserState>): StoreApi<UserState> => {
  if (typeof window === 'undefined') {
    return createUserStore(preloadedState)
  }

  if (!clientStore) {
    clientStore = createUserStore(preloadedState)
  } else if (preloadedState) {
    clientStore.setState((state) => ({
      ...state,
      ...preloadedState,
    }))
  }

  return clientStore
}

export const useUserStore = <T>(selector: (state: UserState) => T): T => {
  const store = initializeUserStore()
  return useStore(store, selector)
}
