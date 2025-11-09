import { create } from 'zustand/react'

export interface UiState {
  loginModel: boolean
  setLoginModel: (value: boolean) => void
}

export const useUiStore = create<UiState>()((set) => ({
  loginModel: false,
  setLoginModel: (value) => set(() => ({ loginModel: value })),
}))
