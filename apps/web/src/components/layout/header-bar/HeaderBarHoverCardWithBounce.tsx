import React, { useState } from 'react'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { motion } from 'motion/react'

const HeaderBarHoverCardWithBounce = ({
  title,
  Svg,
  hidden,
  children,
}: {
  title: string
  Svg: React.ReactNode
  hidden?: boolean
  children?: React.ReactNode
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
        <div
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
        </div>
      </HoverCardTrigger>
      <HoverCardContent sideOffset={20} hidden={hidden} autoFocus={false}>
        {children}
      </HoverCardContent>
    </HoverCard>
  )
}

export default HeaderBarHoverCardWithBounce
