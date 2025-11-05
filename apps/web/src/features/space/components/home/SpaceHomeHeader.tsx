'use client'
import { Button } from '@/components'
import { useRouter } from 'next/navigation'

const SpaceHomeHeader = ({
  desc,
  isLink = true,
  title,
  url,
}: {
  desc?: string
  title: string
  isLink?: boolean
  url?: string
}) => {
  const router = useRouter()
  return (
    <div className={'flex items-center mb-4 h-[34px]'}>
      <h2
        onClick={() => url && router.push(url)}
        className={'text-[24px] cursor-pointer hover:text-brand_blue font-semibold text-text1'}
      >
        {title}
      </h2>
      {desc && (
        <div className={'ml-1.5 text-text2 text-[16px'}>
          <span className={'font-bold mr-2 inline-block'}>·</span>
          {desc}
        </div>
      )}
      {isLink && (
        <div className={'ml-auto'}>
          <Button
            onClick={() => url && router.push(url)}
            className={
              'inline-flex transition-all duration-200 items-center hover:bg-graph_bg_thick hover:border-line_regular w-25 text-text1 border border-line_regular bg-bg1_float h-[34px] px-xsm rounded-md text-4 leading-[1] whitespace-nowrap select-none cursor-pointer'
            }
          >
            查看更多
            <i className={'sic-BDC-arrow_forward_right_line text-xs ml-0.5 text-graph_icon'}></i>
          </Button>
        </div>
      )}
    </div>
  )
}

export default SpaceHomeHeader
