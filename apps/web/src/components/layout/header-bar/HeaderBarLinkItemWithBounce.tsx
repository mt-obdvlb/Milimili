import React, { useState } from 'react'
import { NavigationMenuItem, NavigationMenuLink } from '@/components/ui/navigation-menu'
import { motion } from 'motion/react'

const HeaderBarLinkItemWithBounce = ({ link }: { link: string }) => {
  const [hovered, setHovered] = useState(false)
  const [animating, setAnimating] = useState(false)

  const handleMouseEnter = () => {
    if (animating) return
    setHovered(true)
    setAnimating(true)
  }

  return (
    <NavigationMenuItem key={link}>
      <NavigationMenuLink type='header-bar-first' href='/'>
        <motion.div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={() => {}}
          animate={hovered ? { y: [0, -5, 0] } : { y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          onAnimationComplete={() => {
            setHovered(false)
            setAnimating(false)
          }}
          className='relative flex items-center'
        >
          {link}
        </motion.div>
      </NavigationMenuLink>
    </NavigationMenuItem>
  )
}

export default HeaderBarLinkItemWithBounce
