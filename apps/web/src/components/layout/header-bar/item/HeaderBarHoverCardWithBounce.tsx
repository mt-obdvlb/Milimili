import React, { useState } from 'react'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { motion } from 'motion/react'
import Link from 'next/link'
import { cn, toastBuilding } from '@/lib'
import { Badge } from '@/components'

const HeaderBarHoverCardWithBounce = ({
  title,
  Svg,
  hidden,
  children,
  building,
  href,
  badge = false,
  className,
  alignOffset,
  align,
}: {
  title: string
  Svg: React.ReactNode
  hidden?: boolean
  children?: React.ReactNode
  building?: boolean
  href?: string
  badge?: boolean
  className?: string
  alignOffset?: number
  align?: 'end' | 'center' | 'start'
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
          className={
            'relative flex min-w-[50px] cursor-pointer flex-col items-center justify-center'
          }
        >
          <motion.div
            animate={hovered ? { y: [0, -5, 0] } : { y: 0 }}
            transition={{
              duration: 0.3,
              ease: 'easeOut',
            }}
            onAnimationComplete={() => {
              setHovered(false)
              setAnimating(false)
            }}
          >
            {Svg}
          </motion.div>
          <span className={'text-[13px]'}>{title}</span>

          {badge && (
            <Badge
              variant='destructive'
              className={
                'absolute top-0 left-[35px] z-1 size-1.5 rounded-full bg-[#fa5a57] text-white'
              }
            />
          )}
        </Link>
      </HoverCardTrigger>
      <HoverCardContent
        alignOffset={alignOffset}
        align={align}
        className={cn(
          'bg-bg1_float box-[0_0_30px_rgba(0,0,0,0.1)] border-line_regular text-text1 relative m-0 w-auto rounded-[8px] border p-0',
          className
        )}
        sideOffset={20}
        hidden={hidden}
        autoFocus={false}
      >
        {children}
      </HoverCardContent>
    </HoverCard>
  )
}

export default HeaderBarHoverCardWithBounce
