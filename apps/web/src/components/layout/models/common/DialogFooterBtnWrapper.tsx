'use client'

import { Button } from '@/components'
import { Dispatch, SetStateAction } from 'react'
import { cn } from '@/lib'
import { tv } from 'tailwind-variants'

const dialogFooterBtnMainHoverStyles = tv({
  variants: {
    colors: {
      pink: cn('hover:bg-brand_pink_hover hover:border-brand_pink_hover'),
      blue: cn('hover:bg-brand_blue_hover hover:border-brand_blue_hover'),
      red: cn(''),
    },
  },
})

const dialogFooterBtnMainStyles = tv({
  base: cn(
    '  px-xsm text-4 h-[34px] w-[170px] min-w-25 cursor-pointer rounded-md border leading-[1] whitespace-nowrap text-white transition-all duration-200 select-none'
  ),
  variants: {
    colors: {
      pink: cn('bg-brand_pink border-brand_pink'),
      blue: cn('bg-brand_blue border-brand_blue'),
      red: cn('bg-stress_red border-stress_red'),
    },
  },
})

export type DialogFooterBtnMainStyles = 'pink' | 'blue' | 'red'

const DialogFooterBtnWrapper = ({
  setDialogOpen,
  handleConfirm,
  disabled,
  cancel = '取消',
  colors = 'pink',
}: {
  handleConfirm: (data: never | void) => Promise<void>
  setDialogOpen: Dispatch<SetStateAction<boolean>>
  disabled?: boolean
  cancel?: string
  colors?: DialogFooterBtnMainStyles
}) => {
  const mainHoverStyles = dialogFooterBtnMainHoverStyles({ colors })
  const mainStyles = dialogFooterBtnMainStyles({ colors })

  console.log(disabled)
  return (
    <>
      <Button
        className={
          'text-text1 px-xsm hover:bg-graph_bg_thick text-4 bg-bg1_float border-line_regular h-[34px] w-[170px] min-w-25 cursor-pointer rounded-md border leading-[1] whitespace-nowrap transition-all duration-200 select-none'
        }
        onClick={() => setDialogOpen(false)}
      >
        {cancel}
      </Button>
      <Button
        className={cn(mainStyles, disabled ? 'opacity-50' : mainHoverStyles)}
        disabled={disabled}
        onClick={async () => {
          await handleConfirm()
          setDialogOpen(false)
        }}
      >
        确定
      </Button>
    </>
  )
}

export default DialogFooterBtnWrapper
