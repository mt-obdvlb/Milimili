'use client'

import { useWindowScroll } from 'react-use'
import { useEffect, useState } from 'react'

export const useShow = (yN: number = 500) => {
  const { y } = useWindowScroll()
  const [isShow, setIsShow] = useState(false)
  useEffect(() => {
    setIsShow(y > yN)
  }, [y, yN])
  return { isShow }
}
