import { tv } from 'tailwind-variants'
import { cn } from '@/lib'
import { Dispatch, SetStateAction } from 'react'
import Link from 'next/link'

const HeaderBarSearchBarHistoryItem = ({
  history,
  setHistorys,
}: {
  history: string
  setHistorys: Dispatch<SetStateAction<string[] | undefined>>
}) => {
  const historyItemStyles = tv({
    slots: {
      base: 'relative h-[30px] pt-[7px] pb-[8px] px-2 text-xs group hover:text-brand_blue block leading-[15px] bg-graph_bg_thin rounded-[4px] mr-2.5 mb-2.5 cursor-pointer',
      text: 'whitespace-nowrap overflow-hidden text-ellipsis max-w-[96px]',
      close: cn('absolute size-4 -top-1.5 -right-1.5 hidden group-hover:block p-0.5'),
      svg: 'size-[14px] fill-[#ccc]',
    },
  })

  const { base, text, close, svg } = historyItemStyles()

  return (
    <Link href={`/search?kw=${history}`} target={'_blank'} className={base()}>
      <div className={text()}>{history}</div>
      <div
        className={close()}
        onMouseDown={(e) => {
          e.stopPropagation()
          setHistorys((prev) => prev?.filter((item) => item !== history))
        }}
      >
        <svg className={svg()} viewBox='0 0 1024 1024' width='14' height='14'>
          <path
            d='M512 64.303538c-247.25636 0-447.696462 200.440102-447.696462 447.696462
                0 247.254314 200.440102 447.696462 447.696462 447.696462s447.696462-200.440102
                447.696462-447.696462S759.25636 64.303538 512 64.303538zM710.491727 665.266709c12.491499
                12.491499 12.489452 32.729425-0.002047 45.220924-6.246261 6.246261-14.429641 9.370415-22.611997
                9.370415s-16.363689-3.121084-22.60995-9.366322L512 557.222971 358.730221 710.491727
                c-6.246261 6.246261-14.429641 9.366322-22.611997 9.366322s-16.365736-3.125177-22.611997-9.370415
                c-12.491499-12.491499-12.491499-32.729425 0-45.220924l153.268756-153.266709L313.50725 358.730221
                c-12.491499-12.491499-12.489452-32.729425 0.002047-45.220924s32.729425-12.495592 45.220924-0.004093
                l153.268756 153.268756 153.268756-153.268756c12.491499-12.491499 32.729425-12.487406 45.220924
                0.004093s12.493545 32.729425 0.002047 45.220924L557.225017 512 710.491727 665.266709z'
          ></path>
        </svg>
      </div>
    </Link>
  )
}

export default HeaderBarSearchBarHistoryItem
