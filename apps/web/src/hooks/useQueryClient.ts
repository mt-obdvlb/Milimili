import { useState } from 'react'
import { QueryClient } from '@tanstack/react-query'

export const useQueryClientInstance = () =>
  useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  )
