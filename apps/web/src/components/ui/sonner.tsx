'use client'

import { useTheme } from 'next-themes'
import { Toaster as Sonner, ToasterProps } from 'sonner'

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner visibleToasts={1} duration={500} theme={theme as ToasterProps['theme']} {...props} />
  )
}

export { Toaster }
