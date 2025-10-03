import { Dispatch, SetStateAction } from 'react'
import { useCountdownClose } from '@/hooks/useCountdownClose'
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components'
import Image from 'next/image'
import { openNewTab } from '@/utils'

const FeedSharedSuccess = ({
  open,
  setOpen,
  href,
}: {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  href: string
}) => {
  const { countdown } = useCountdownClose(open, setOpen)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className={'rounded-[8px]   shadow-[0_13px_20px_0_rgba(106,115,133,.22)]'}>
        <DialogHeader>
          <DialogTitle></DialogTitle>
        </DialogHeader>
        <div className={'items-center flex flex-col  rounded-[8px] w-[344px] py-2.5 px-3'}>
          <Image
            src={'/images/feed-shared-success.png'}
            alt={'分享成功'}
            width={149}
            height={157}
          />
          <div className={'text-text1 text-[20px] mr-5'}>分享成功</div>
          <div
            onClick={() => openNewTab(href)}
            className={'text-brand_blue cursor-pointer text-[16px] mt-3 mb-5'}
          >
            查看我分享的动态
          </div>
          <Button
            className={
              'w-[150px] text-sm h-8 px-3 bg-bg1 border border-[#dcdfe6] rounded-[4px] cursor-pointer' +
              ' inline-block leading-[1] m-0 transition-all duration-200 whitespace-nowrap'
            }
            onClick={() => setOpen(false)}
          >
            关闭 {countdown.toFixed(0)}s
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default FeedSharedSuccess
