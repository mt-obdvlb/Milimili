import React, { useState } from 'react'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { motion } from 'motion/react'
import Link from 'next/link'
import { toastBuilding } from '@/lib'

const HeaderBarHoverCardWithBounce = ({
  title,
  Svg,
  hidden,
  children,
  building,
  href,
}: {
  title: string
  Svg: React.ReactNode
  hidden?: boolean
  children?: React.ReactNode
  building?: boolean
  href?: string
}) => {
  const [hovered, setHovered] = useState(false)
  const [animating, setAnimating] = useState(false)

  const handleMouseEnter = () => {
    if (animating) return
    setHovered(true)
    setAnimating(true)
  }

  return (
    <HoverCard openDelay={150} closeDelay={150}>
      <HoverCardTrigger asChild>
        <Link
          href={href ?? ''}
          onClick={building ? toastBuilding : () => {}}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={() => {}}
          className={'flex min-w-[50px] cursor-pointer flex-col items-center justify-center'}
        >
          <motion.div
            animate={hovered ? { y: [0, -5, 0] } : { y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            onAnimationComplete={() => {
              setHovered(false)
              setAnimating(false)
            }}
          >
            {Svg}
          </motion.div>
          <span className={'text-[13px]'}>{title}</span>
        </Link>
      </HoverCardTrigger>
      <HoverCardContent sideOffset={20} hidden={hidden} autoFocus={false}>
        {children}
      </HoverCardContent>
    </HoverCard>
  )
}

export default HeaderBarHoverCardWithBounce
