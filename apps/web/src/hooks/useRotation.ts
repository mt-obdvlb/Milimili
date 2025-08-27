'use client'

import { CSSProperties, useState } from 'react'

export const useRotation = (step: number = 360) => {
  const [rotation, setRotation] = useState(0)

  const rotate = () => {
    setRotation((prev) => prev + step)
  }

  const style: CSSProperties = {
    transform: `rotate(${rotation}deg)`,
  }

  return { rotation, rotate, style }
}
