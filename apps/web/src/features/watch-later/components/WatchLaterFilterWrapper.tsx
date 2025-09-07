'use client'

import { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from 'react'
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
} from '@/components'
import { cn } from '@/lib'
import Filter from '@/components/layout/filter/Filter'
import { DateRange } from 'react-day-picker'
import {
  VideoGetWatchLaterAddAt,
  VideoGetWatchLaterTime,
  VideoGetWatchLaterType,
} from '@mtobdvlb/shared-types'
import DatePickerWrapper from '@/components/layout/date-picker/DatePickerWrapper'

type WatchLaterFilterProps = {
  setTime: Dispatch<SetStateAction<VideoGetWatchLaterTime>>
  setAddAt: Dispatch<SetStateAction<VideoGetWatchLaterAddAt>>
  addAt: VideoGetWatchLaterAddAt
  time: VideoGetWatchLaterTime
  range?: DateRange
  setRange: Dispatch<SetStateAction<DateRange | undefined>>
  type: VideoGetWatchLaterType
  setType: Dispatch<SetStateAction<VideoGetWatchLaterType>>
  setKw: Dispatch<SetStateAction<string>>
  isDetail: boolean
}

const timeList = [
  { label: '全部时间', value: 'all' },
  { label: '10分钟以下', value: '10' },
  { label: '10-30分钟', value: '10to30' },
  { label: '30-60分钟', value: '30to60' },
  { label: '60分钟以上', value: '60' },
] as const

const addAtList = [
  { label: '全部添加', value: 'all' },
  { label: '今天', value: 'today' },
  { label: '昨天', value: 'yesterday' },
  { label: '近一周', value: 'week' },
] as const

const typeList = [
  { label: '全部进度', value: 'all' },
  { label: '未看完', value: 'not_watched' },
] as const

const WatchLaterFilterWrapper = ({
  setTime,
  time,
  range,
  setRange,
  addAt,
  setAddAt,
  setType,
  type,
  setKw,
  isDetail,
}: WatchLaterFilterProps) => {
  const [open, setOpen] = useState(false)
  const [currenInput, setCurrenInput] = useState('')
  const [resetKey, setResetKey] = useState(0)
  const [isFocus, setIsFocus] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  const ref = useRef<HTMLDivElement>(null)

  const inputRef = useRef<HTMLInputElement>(null)
  const isExpend = useMemo(
    () => !isDetail || isFocus || currenInput,
    [isDetail, isFocus, currenInput]
  )

  useEffect(() => {
    if (!ref.current) return
    const el = ref.current
    if (open) {
      const h = el.scrollHeight
      el.style.height = '0px'
      requestAnimationFrame(() => {
        el.style.height = h + 'px'
      })
      const end = () => {
        el.style.height = 'auto'
        el.removeEventListener('transitionend', end)
      }
      el.addEventListener('transitionend', end)
    } else {
      const h = el.scrollHeight
      el.style.height = h + 'px'
      requestAnimationFrame(() => {
        el.style.height = '0px'
      })
    }
  }, [open])

  const handleConfirm = async () => {
    setDialogOpen(false)
  }

  return (
    <div
      className={cn(
        'mx-auto w-full max-w-[calc(1080px+2*100px)] px-25',
        isDetail && 'max-w-[calc(890px+2*100px)]'
      )}
    >
      <div className={'mt-[10px] py-[20px]'}>
        <div className={'flex items-center'}>
          <div className={'flex w-full items-center gap-2'}>
            <Filter<VideoGetWatchLaterType>
              className={'h-[34px] text-[15px]'}
              value={type}
              set={setType}
              list={typeList}
            />
            <div className={'relative mr-4 pl-6'}>
              <div
                className={'bg-line_regular absolute top-1/2 left-0 h-3 w-[0.5px] -translate-y-1/2'}
              ></div>
              <Button
                className={
                  'text-text1 bg-bg1_float border-line_regular hover:bg-graph_bg_thick inline-flex h-[34px] min-w-25 cursor-pointer items-center justify-around rounded-[8px] border px-2.5 text-sm leading-[1] whitespace-nowrap duration-200 select-none'
                }
                onClick={() => setOpen(!open)}
              >
                更多筛选
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                  width='24'
                  height='24'
                  className={cn(
                    'size-[13px] rotate-90 transition-all duration-200',
                    open && '-rotate-90'
                  )}
                >
                  <path
                    d='M8.5429 3.04289C8.15237 3.43342 8.15237 4.06658 8.5429 4.45711L15.909 11.8232C16.0066 11.9209 16.0066 12.0791 15.909 12.1768L8.5429 19.5429C8.15237 19.9334 8.15237 20.5666 8.5429 20.9571C8.93342 21.3476 9.56659 21.3476 9.95711 20.9571L17.3232 13.591C18.2019 12.7123 18.2019 11.2877 17.3232 10.409L9.95711 3.04289C9.56659 2.65237 8.93342 2.65237 8.5429 3.04289z'
                    fill='currentColor'
                  ></path>
                </svg>
              </Button>
            </div>
          </div>
          <div className={'bg-bg1_float flex items-center gap-3 text-sm font-normal'}>
            <label
              className={cn(
                'bg-graph_bg_regular text-text1 border-graph_bg_regular flex h-[34px] w-[160px] items-center justify-end rounded-[8px] border p-[2px] pr-0 transition-all duration-300',
                isFocus && 'bg-transparent',
                !isExpend && 'w-[34px] border-none bg-transparent p-0'
              )}
            >
              {isExpend && (
                <div
                  className={
                    'relative flex h-full overflow-hidden transition-[max-width] duration-300'
                  }
                >
                  <Input
                    className={cn(
                      'text-text1 size-full rounded-[8px] pr-[30px] pl-[10px] text-sm transition-colors duration-300',
                      isFocus && 'bg-[#F1F2F3]'
                    )}
                    ref={inputRef}
                    value={currenInput}
                    onChange={(e) => setCurrenInput(e.target.value)}
                    placeholder={'搜索稍后再看'}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                  />
                  <i
                    className={
                      'text-graph_weak absolute top-1/2 right-2.5 inline-block -translate-y-1/2 cursor-pointer align-baseline text-[16px] leading-[1] font-normal'
                    }
                    onClick={() => {
                      setCurrenInput('')
                      setKw('')
                    }}
                  >
                    <span
                      className={cn(
                        'not-italic',
                        currenInput.length > 0 && 'sic-BDC-xmark_close_circle_fill'
                      )}
                    ></span>
                  </i>
                </div>
              )}
              <div
                className={
                  'text-text1 flex size-[calc(34px-2*1px)] shrink-0 cursor-pointer items-center justify-center'
                }
                onClick={() => {
                  if (isExpend) {
                    setKw(currenInput)
                  } else {
                    inputRef.current?.focus()
                    setIsFocus(true)
                  }
                }}
              >
                <i
                  className={cn(
                    'sic-BDC-magnifier_search_line inline-block align-baseline text-[20px] leading-[1] font-normal not-italic'
                  )}
                ></i>
              </div>
            </label>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  className={cn(
                    'text-text1 hover:bg-graph_bg_thick bg-bg1_float border-line_regular text-4 flex h-[34px] max-w-30 min-w-25 cursor-pointer items-center justify-center rounded-md border px-3 leading-[1] whitespace-nowrap transition-all delay-100 duration-300 select-none',
                    !isExpend && 'w-[34px] max-w-[34px] min-w-[34px] p-0'
                  )}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 16 16'
                    width='16'
                    height='16'
                  >
                    <path
                      d='M3.0161466666666663 8.166933333333333C3.2921466666666666 8.175833333333333 3.5086733333333333 8.4068 3.4997666666666665 8.6828L3.3719466666666666 12.645166666666665C3.3598 13.0216 3.6616533333333328 13.333333333333332 4.038259999999999 13.333333333333332L11.961799999999998 13.333333333333332C12.3384 13.333333333333332 12.640233333333331 13.0216 12.6281 12.645166666666665L12.5003 8.6828C12.4914 8.4068 12.707899999999999 8.175833333333333 12.9839 8.166933333333333C13.259899999999998 8.158033333333332 13.490866666666665 8.374566666666666 13.499766666666666 8.650566666666666L13.627566666666667 12.612933333333332C13.657933333333332 13.553999999999998 12.903333333333332 14.333333333333332 11.961799999999998 14.333333333333332L4.038259999999999 14.333333333333332C3.09672 14.333333333333332 2.3421133333333333 13.553999999999998 2.3724666666666665 12.612933333333332L2.5002866666666668 8.650566666666666C2.509193333333333 8.374566666666666 2.7401533333333328 8.158033333333332 3.0161466666666663 8.166933333333333z'
                      fill='currentColor'
                    ></path>
                    <path
                      d='M9.666666666666666 11C9.942799999999998 11 10.166666666666666 11.223866666666666 10.166666666666666 11.5L10.166666666666666 13.5C10.166666666666666 13.776133333333334 9.942799999999998 14 9.666666666666666 14C9.390533333333334 14 9.166666666666666 13.776133333333334 9.166666666666666 13.5L9.166666666666666 11.5C9.166666666666666 11.223866666666666 9.390533333333334 11 9.666666666666666 11z'
                      fill='currentColor'
                    ></path>
                    <path
                      d='M6.333333333333333 11.666666666666666C6.60948 11.666666666666666 6.833333333333333 11.890533333333332 6.833333333333333 12.166666666666666L6.833333333333333 13.5C6.833333333333333 13.776133333333334 6.60948 14 6.333333333333333 14C6.057193333333332 14 5.833333333333333 13.776133333333334 5.833333333333333 13.5L5.833333333333333 12.166666666666666C5.833333333333333 11.890533333333332 6.057193333333332 11.666666666666666 6.333333333333333 11.666666666666666z'
                      fill='currentColor'
                    ></path>
                    <path
                      d='M9.605366666666665 2.8755066666666664C9.2884 2.773766666666667 8.771633333333334 2.66648 8.0001 2.6666666666666665C7.229033333333334 2.66686 6.712366666666666 2.774013333333333 6.395206666666667 2.875653333333333C6.245573333333333 2.9236066666666667 6.166666666666666 3.1068066666666665 6.166666666666666 3.3040066666666665L6.166666666666666 4.713846666666667C6.166666666666666 5.2276 5.777373333333333 5.6577666666666655 5.266173333333333 5.708886666666666L3.733833333333333 5.862119999999999C3.222633333333333 5.913239999999999 2.833333333333333 6.343406666666667 2.833333333333333 6.8571333333333335L2.833333333333333 7.872633333333333C2.833333333333333 7.9623333333333335 2.9017133333333334 8.0339 2.9881266666666666 8.038566666666666C3.8894466666666667 8.087366666666666 5.70666 8.166666666666666 8 8.166666666666666C10.293333333333333 8.166666666666666 12.110533333333333 8.087366666666666 13.011866666666666 8.038566666666666C13.098266666666667 8.0339 13.166666666666666 7.9623333333333335 13.166666666666666 7.872633333333333L13.166666666666666 6.8571333333333335C13.166666666666666 6.343406666666667 12.777366666666666 5.913239999999999 12.266166666666665 5.862119999999999L10.733833333333333 5.708886666666666C10.222633333333333 5.6577666666666655 9.833333333333332 5.2276 9.833333333333332 4.713846666666667L9.833333333333332 3.3033333333333332C9.833333333333332 3.1064266666666662 9.754633333333333 2.92342 9.605366666666665 2.8755066666666664zM7.9999 1.6666666666666665C8.865133333333333 1.66646 9.485999999999999 1.78694 9.911 1.9233533333333332C10.5684 2.1343733333333335 10.833333333333332 2.7629133333333336 10.833333333333332 3.3033333333333332L10.833333333333332 4.635413333333333C10.833333333333332 4.67994 10.867066666666666 4.717219999999999 10.911366666666666 4.721653333333333L12.365666666666666 4.86708C13.388066666666667 4.96932 14.166666666666666 5.829653333333333 14.166666666666666 6.8571333333333335L14.166666666666666 7.879266666666666C14.166666666666666 8.489899999999999 13.694233333333333 9.003 13.075033333333332 9.036633333333333C12.163466666666666 9.086099999999998 10.3232 9.166666666666666 8 9.166666666666666C5.6768 9.166666666666666 3.8365333333333336 9.086099999999998 2.924946666666666 9.036633333333333C2.3057733333333332 9.003 1.8333333333333333 8.489899999999999 1.8333333333333333 7.879266666666666L1.8333333333333333 6.8571333333333335C1.8333333333333333 5.829653333333333 2.6119266666666663 4.96932 3.6343266666666665 4.86708L5.088626666666666 4.721653333333333C5.132933333333333 4.717219999999999 5.166666666666666 4.67994 5.166666666666666 4.635413333333333L5.166666666666666 3.3040066666666665C5.166666666666666 2.763 5.43214 2.134193333333333 6.09002 1.92336C6.514873333333332 1.7872066666666666 7.135333333333333 1.6668733333333332 7.9999 1.6666666666666665z'
                      fill='currentColor'
                    ></path>
                  </svg>
                  {isExpend && (
                    <span
                      className={
                        'ml-1 max-w-25 overflow-hidden transition-all delay-[inherit] duration-300'
                      }
                    >
                      清除已看完
                    </span>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent
                showCloseButton={false}
                className={
                  'text-text1 bg-bg1 w-100 rounded-xl px-6 pt-10 pb-6 text-sm shadow-[0_8px_40px_rgba(0,0,0,.1)]'
                }
              >
                <DialogClose
                  className={
                    'text-text2 hover:bg-graph_bg_regular_float absolute top-[14px] right-[14px] flex size-8 cursor-pointer items-center justify-center rounded-md transition-all transition-colors duration-200'
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
                  <DialogTitle
                    className={'text-text1 text-center text-[16px] leading-5.5 font-medium'}
                  >
                    一键清除已看完视频
                  </DialogTitle>
                </DialogHeader>
                <DialogDescription className={'text-text2 mt-2 mb-6 text-center text-sm'}>
                  <div>视频清除后将不出现在稍后再看中</div>
                </DialogDescription>
                <DialogFooter className={'bg-bg1 mt-6 flex h-8 justify-center gap-3'}>
                  <Button
                    className={
                      'text-text1 px-xsm hover:bg-graph_bg_thick text-4 bg-bg1_float border-line_regular h-[34px] w-[170px] min-w-25 cursor-pointer rounded-md border leading-[1] whitespace-nowrap transition-all duration-200 select-none'
                    }
                    onClick={() => setDialogOpen(false)}
                  >
                    取消
                  </Button>
                  <Button
                    className={
                      'bg-brand_pink hover:bg-brand_pink_hover hover:border-brand_pink_hover border-brand_pink px-xsm text-4 h-[34px] w-[170px] min-w-25 cursor-pointer rounded-md border leading-[1] whitespace-nowrap text-white transition-all duration-200 select-none'
                    }
                    onClick={handleConfirm}
                  >
                    确定
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            {[
              {
                label: '批量管理',
                svg: (
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 16 16'
                    width='16'
                    height='16'
                  >
                    <path
                      d='M6.208333333333333 8C6.208333333333333 7.654816666666666 6.488158333333333 7.375 6.833333333333333 7.375L13.5 7.375C13.845183333333333 7.375 14.125 7.654816666666666 14.125 8C14.125 8.345183333333333 13.845183333333333 8.625 13.5 8.625L6.833333333333333 8.625C6.488158333333333 8.625 6.208333333333333 8.345183333333333 6.208333333333333 8z'
                      fill='currentColor'
                    ></path>
                    <path
                      d='M6.208333333333333 3.833333333333333C6.208333333333333 3.4881583333333332 6.488158333333333 3.208333333333333 6.833333333333333 3.208333333333333L13.5 3.208333333333333C13.845183333333333 3.208333333333333 14.125 3.4881583333333332 14.125 3.833333333333333C14.125 4.178508333333333 13.845183333333333 4.458333333333333 13.5 4.458333333333333L6.833333333333333 4.458333333333333C6.488158333333333 4.458333333333333 6.208333333333333 4.178508333333333 6.208333333333333 3.833333333333333z'
                      fill='currentColor'
                    ></path>
                    <path
                      d='M6.208333333333333 12.166666666666666C6.208333333333333 11.821483333333333 6.488158333333333 11.541666666666666 6.833333333333333 11.541666666666666L13.5 11.541666666666666C13.845183333333333 11.541666666666666 14.125 11.821483333333333 14.125 12.166666666666666C14.125 12.511849999999999 13.845183333333333 12.791666666666666 13.5 12.791666666666666L6.833333333333333 12.791666666666666C6.488158333333333 12.791666666666666 6.208333333333333 12.511849999999999 6.208333333333333 12.166666666666666z'
                      fill='currentColor'
                    ></path>
                    <path
                      d='M3.5 7.541666666666666C3.2468683333333335 7.541666666666666 3.0416666666666665 7.746858333333333 3.0416666666666665 8C3.0416666666666665 8.253141666666666 3.2468683333333335 8.458333333333332 3.5 8.458333333333332C3.7531316666666665 8.458333333333332 3.958333333333333 8.253141666666666 3.958333333333333 8C3.958333333333333 7.746858333333333 3.7531316666666665 7.541666666666666 3.5 7.541666666666666zM1.7916666666666665 8C1.7916666666666665 7.056541666666666 2.5565116666666663 6.291666666666666 3.5 6.291666666666666C4.443488333333333 6.291666666666666 5.208333333333333 7.056541666666666 5.208333333333333 8C5.208333333333333 8.943458333333332 4.443488333333333 9.708333333333332 3.5 9.708333333333332C2.5565116666666663 9.708333333333332 1.7916666666666665 8.943458333333332 1.7916666666666665 8z'
                      fill='currentColor'
                    ></path>
                    <path
                      d='M5.30542 2.5626816666666663C5.546944999999999 2.8092883333333334 5.542825000000001 3.2049950000000003 5.29622 3.44652L3.8277183333333333 4.884758333333333C3.455145 5.249653333333333 2.859188333333333 5.249653333333333 2.4866149999999996 4.884758333333333L1.7579949999999998 4.171158333333333C1.5113883333333331 3.9296333333333333 1.50727 3.533928333333333 1.7487949999999999 3.2873216666666663C1.9903199999999999 3.0407149999999996 2.3860266666666665 3.0365966666666666 2.6326316666666667 3.2781216666666664L3.157166666666667 3.7918416666666666L4.421588333333333 2.5534816666666664C4.668193333333333 2.311956666666666 5.063899999999999 2.3160749999999997 5.30542 2.5626816666666663z'
                      fill='currentColor'
                    ></path>
                    <path
                      d='M5.30542 10.896016666666668C5.546944999999999 11.142641666666666 5.542825000000001 11.53833333333333 5.29622 11.779833333333332L3.8277183333333333 13.2181C3.455145 13.582966666666668 2.859188333333333 13.582966666666668 2.4866149999999996 13.2181L1.7579949999999998 12.5045C1.5113883333333331 12.263 1.50727 11.86725 1.7487949999999999 11.620683333333332C1.9903199999999999 11.374058333333332 2.3860266666666665 11.369933333333332 2.6326316666666667 11.611433333333332L3.157166666666667 12.125183333333334L4.421588333333333 10.886833333333332C4.668193333333333 10.645275 5.063899999999999 10.6494 5.30542 10.896016666666668z'
                      fill='currentColor'
                    ></path>
                  </svg>
                ),
                onClick: () => {},
              },
            ].map((item) => (
              <Button
                className={cn(
                  'text-text1 hover:bg-graph_bg_thick bg-bg1_float border-line_regular text-4 flex h-[34px] max-w-30 min-w-25 cursor-pointer items-center justify-center rounded-md border px-3 leading-[1] whitespace-nowrap transition-all delay-100 duration-300 select-none',
                  !isExpend && 'w-[34px] max-w-[34px] min-w-[34px] p-0'
                )}
                key={item.label}
                onClick={item.onClick}
              >
                {item.svg}
                {isExpend && (
                  <span
                    className={
                      'ml-1 max-w-25 overflow-hidden transition-all delay-[inherit] duration-300'
                    }
                  >
                    {item.label}
                  </span>
                )}
              </Button>
            ))}
          </div>
        </div>
        <div ref={ref} className={cn('overflow-hidden transition-[height] duration-200')}>
          <Filter<VideoGetWatchLaterAddAt>
            value={addAt}
            set={(val) => {
              setAddAt(val)
              setResetKey(resetKey + 1)
            }}
            list={addAtList}
            mt
            className={'h-[34px] text-[15px]'}
          >
            <DatePickerWrapper range={range} setRange={setRange} resetKey={resetKey} />
          </Filter>
          <Filter<VideoGetWatchLaterTime>
            className={'h-[34px] text-[15px]'}
            value={time}
            set={setTime}
            list={timeList}
            mt
          ></Filter>
        </div>
      </div>
    </div>
  )
}

export default WatchLaterFilterWrapper
