'use client'

import { Button } from '@/components'
import { Dispatch, SetStateAction } from 'react'
import { cn } from '@/lib'

const DialogFooterBtnWrapper = ({
  setDialogOpen,
  handleConfirm,
  disabled,
  cancel = '取消',
}: {
  handleConfirm: (data: never | void) => Promise<void>
  setDialogOpen: Dispatch<SetStateAction<boolean>>
  disabled?: boolean
  cancel?: string
}) => {
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
        className={cn(
          'bg-brand_pink border-brand_pink px-xsm text-4 h-[34px] w-[170px] min-w-25 cursor-pointer rounded-md border leading-[1] whitespace-nowrap text-white transition-all duration-200 select-none',
          disabled ? 'opacity-50' : 'hover:bg-brand_pink_hover hover:border-brand_pink_hover'
        )}
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
