'use client'

import { useEffect } from 'react'
import { initializeUserStore, UserState } from '@/stores/user'

export const StoreInitializer = ({ initialUser }: { initialUser?: Partial<UserState> }) => {
  const store = initializeUserStore()

  useEffect(() => {
    if (initialUser) {
      store.setState((state) => ({
        ...state,
        ...initialUser,
      }))
    }
  }, [initialUser, store])

  return null
}
