'use client'

import { initializeUserStore, UserState } from '@/stores/user'

export const StoreInitializer = ({ initialUser }: { initialUser?: Partial<UserState> }) => {
  initializeUserStore(initialUser)
  return null
}
