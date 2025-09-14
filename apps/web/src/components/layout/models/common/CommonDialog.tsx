'use client'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogFooterBtnMainStyles,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components'
import { ReactNode, useState } from 'react'
import DialogFooterBtnWrapper from '@/components/layout/models/common/DialogFooterBtnWrapper'

const CommonDialog = ({
  handleConfirm,
  title,
  desc,
  children,
  mainStyles,
  trigger,
}: {
  handleConfirm: (folderId: string | void) => Promise<void>
  title: string
  desc?: string
  children?: ReactNode
  mainStyles?: DialogFooterBtnMainStyles
  trigger: ReactNode
}) => {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className={
          'text-text1 bg-bg1 w-100 rounded-xl px-6 pt-10 pb-6 text-sm shadow-[0_8px_40px_rgba(0,0,0,.1)]'
        }
      >
        <DialogClose
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
        </DialogClose>
        <DialogHeader className={'text-text1 text-sm'}>
          <DialogTitle className={'text-text1 text-center text-[16px] leading-5.5 font-medium'}>
            {title}
          </DialogTitle>
        </DialogHeader>
        {children ? (
          children
        ) : (
          <div className={'text-text2 mt-2 mb-6 text-center text-sm'}>
            <div>{desc}</div>
          </div>
        )}
        <DialogFooter className={'bg-bg1 mt-6 flex h-8 justify-center gap-3'}>
          <DialogFooterBtnWrapper
            colors={mainStyles}
            handleConfirm={handleConfirm}
            setDialogOpen={setDialogOpen}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CommonDialog
