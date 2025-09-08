import { ReactNode } from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components'

const WatchLaterSelectFilterBtn = ({
  isSelect,
  children,
}: {
  isSelect: boolean
  children?: ReactNode
}) => {
  return (
    <Tooltip open={isSelect ? false : undefined} delayDuration={150}>
      <TooltipTrigger asChild>
        <div className={'inline-block'}>{children}</div>
      </TooltipTrigger>
      <TooltipContent hiddenArrow>
        <div
          className={
            'text-4 rounded-xl border-none bg-black px-4 py-3 leading-5 text-white shadow-[0_2px_8px_#00000014]'
          }
        >
          <div>请选择视频</div>
        </div>
      </TooltipContent>
    </Tooltip>
  )
}

export default WatchLaterSelectFilterBtn
