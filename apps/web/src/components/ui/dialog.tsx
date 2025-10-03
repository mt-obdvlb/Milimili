'use client'

import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'

import { cn } from '@/lib/utils'

function Dialog({ ...props }: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot='dialog' {...props} />
}

function DialogTrigger({ ...props }: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot='dialog-trigger' {...props} />
}

function DialogPortal({ ...props }: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot='dialog-portal' {...props} />
}

function DialogClose({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return (
    <DialogPrimitive.Close
      data-slot='dialog-close'
      className={cn('outline-none', className)}
      {...props}
    />
  )
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot='dialog-overlay'
      className={cn(
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-10010 bg-black/50',
        className
      )}
      {...props}
    />
  )
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean
}) {
  return (
    <DialogPortal data-slot='dialog-portal'>
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot='dialog-content'
        className={cn(
          'data-[state=open]:animate-in data-[state=closed]:animate-out outline-none data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 text-text1 bg-bg1 fixed top-[50%] left-[50%] z-10010 translate-x-[-50%] translate-y-[-50%] rounded-xl text-sm shadow-[0_8px_40px_rgba(0,0,0,.1)] duration-200',
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot='dialog-close'
            className={
              'text-text2 hover:bg-graph_bg_regular_float absolute top-[14px] right-[14px] flex size-8 cursor-pointer items-center justify-center rounded-md transition-all duration-200'
            }
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 20 20'
              width='20'
              height='20'
              className={'text-text2 size-[20px] cursor-pointer overflow-hidden'}
            >
              <path
                d='M4.106275 4.108583333333334C4.350341666666667 3.8645000000000005 4.746083333333333 3.8645000000000005 4.9901583333333335 4.108583333333334L9.998666666666667 9.117125L15.008583333333334 4.107216666666667C15.252625 3.8631333333333338 15.648375000000001 3.8631333333333338 15.892458333333334 4.107216666666667C16.136541666666666 4.351291666666667 16.136541666666666 4.747025000000001 15.892458333333334 4.9911L10.882541666666667 10.001000000000001L15.891375 15.009791666666667C16.135458333333332 15.253874999999999 16.135458333333332 15.649625 15.891375 15.893708333333334C15.647291666666668 16.13775 15.251541666666668 16.13775 15.0075 15.893708333333334L9.998666666666667 10.884875000000001L4.991233333333334 15.892333333333333C4.747158333333333 16.13641666666667 4.351425 16.13641666666667 4.10735 15.892333333333333C3.8632750000000002 15.648249999999999 3.8632750000000002 15.252541666666666 4.10735 15.008458333333333L9.114791666666667 10.001000000000001L4.106275 4.992466666666667C3.8621916666666665 4.7483916666666675 3.8621916666666665 4.352658333333333 4.106275 4.108583333333334z'
                fill='currentColor'
              ></path>
            </svg>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div data-slot='dialog-header' className={cn('text-text1 text-sm', className)} {...props} />
  )
}

function DialogFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot='dialog-footer' className={cn('', className)} {...props} />
}

function DialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot='dialog-title'
      className={cn('text-text1 text-center text-[16px] leading-5.5 font-medium', className)}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot='dialog-description'
      className={cn('', className)}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
