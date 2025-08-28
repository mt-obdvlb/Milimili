'use client'

import { Button } from '@/components'
import { cn } from '@/lib'

const ToTopBtn = ({
  className,
  isShow,
  inlineClassName,
}: {
  className?: string
  inlineClassName?: string
  isShow: boolean
}) => {
  return (
    <div className={className}>
      <Button
        variant={'primary'}
        className={cn(
          'hover:bg-graph_bg_thick pointer-events-auto mt-3 ml-0 h-auto min-h-10 w-10 flex-col items-center px-0 pt-2 pb-1.5 text-[22px] opacity-100 transition-opacity duration-300 select-auto',
          inlineClassName,
          isShow ? 'opacity-100' : 'opacity-0'
        )}
        onClick={() =>
          window.scrollTo({
            top: 0,
            behavior: 'smooth',
          })
        }
      >
        <svg
          data-v-d05c53ac=''
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 24 24'
          width='24'
          height='24'
          fill='currentColor'
          className={'size-3'}
        >
          <path
            d='M20.3964 12.83585C21.65635 14.0958 20.76405 16.2501 18.9822 16.2501L5.01774 16.2501C3.23594 16.2501 2.34359 14.0958 3.60353 12.83585L10.58575 5.85361C11.3668 5.07256 12.63315 5.07256 13.4142 5.85361L20.3964 12.83585z'
            fill='currentColor'
          ></path>
        </svg>
        <span className={'mt-0.5 text-center text-xs leading-3.5'}>顶部</span>
      </Button>
    </div>
  )
}

export default ToTopBtn
