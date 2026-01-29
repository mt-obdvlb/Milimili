'use client'

import React, { cloneElement, createContext, ReactNode, useContext, useRef, useState } from 'react'
import { cn } from '@/lib'

interface HoverCardPureProps {
  children: ReactNode
  openDelay?: number
  closeDelay?: number
  open?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
}

interface HoverCardPureContextValue {
  isOpen: boolean
  open: () => void
  close: () => void
}

const HoverCardPureContext = createContext<HoverCardPureContextValue | null>(null)

const HoverCardPure = ({
  children,
  openDelay = 150,
  closeDelay = 100,
  open,
  onOpenChange,
  className,
}: HoverCardPureProps) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const isControlled = typeof open === 'boolean'
  const isOpen = isControlled ? open : uncontrolledOpen

  const setOpen = (value: boolean) => {
    if (!isControlled) {
      setUncontrolledOpen(value)
    }
    onOpenChange?.(value)
  }

  const openHandler = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setOpen(true)
    }, openDelay)
  }

  const closeHandler = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setOpen(false)
    }, closeDelay)
  }

  return (
    <HoverCardPureContext.Provider value={{ isOpen, open: openHandler, close: closeHandler }}>
      <div data-state={isOpen ? 'open' : 'closed'} className={cn('relative', className)}>
        {children}
      </div>
    </HoverCardPureContext.Provider>
  )
}

interface HoverCardPureTriggerProps {
  children: ReactNode
  asChild?: boolean
}

const HoverCardPureTrigger = ({ children, asChild = false }: HoverCardPureTriggerProps) => {
  const ctx = useContext(HoverCardPureContext)
  if (!ctx) throw new Error('HoverCardPureTrigger must be inside HoverCardPure')

  const triggerProps = {
    onMouseEnter: ctx.open,
    onMouseLeave: ctx.close,
  }

  if (asChild && React.isValidElement(children)) {
    return cloneElement(children as unknown as React.ReactElement, triggerProps)
  }

  return <div {...triggerProps}>{children}</div>
}

interface HoverCardPureContentProps {
  children: ReactNode
  className?: string
}

const HoverCardPureContent = ({ children, className }: HoverCardPureContentProps) => {
  const ctx = useContext(HoverCardPureContext)
  if (!ctx) throw new Error('HoverCardPureContent must be inside HoverCardPure')

  if (!ctx.isOpen) return null

  return (
    <div className={className} onMouseEnter={ctx.open} onMouseLeave={ctx.close}>
      {children}
    </div>
  )
}

export { HoverCardPureContent, HoverCardPureTrigger, HoverCardPure }
