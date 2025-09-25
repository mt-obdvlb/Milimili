'use client'

import { useUiStore } from '@/stores'

export const useModel = () => {
  const { setLoginModel } = useUiStore()
  return {
    openLoginModel: () => setLoginModel(true),
    closeLoginModel: () => setLoginModel(false),
  }
}
