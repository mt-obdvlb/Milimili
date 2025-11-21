'use client'

import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import TinyVideoItem from '@/components/layout/video/TinyVideoItem'
import { useHistoryDeleteBatch } from '@/features'
import HistoryCheckBox from '@/features/history/components/HistoryCheckBox'
import { cn, toast } from '@/lib'
import { HistoryGetList } from '@mtobdvlb/shared-types'
import dayjs from 'dayjs'
import Link from 'next/link'
import { tv } from 'tailwind-variants'
import { useInView } from 'react-intersection-observer'

type Props = {
  label: string
  historyList: HistoryGetList
  isDetail: boolean
  setIds: Dispatch<SetStateAction<string[]>>
  isSelect: boolean
  ids: string[]
  index: number
  isSticky: boolean
  total: number
}

const HistoryTimeLineItem: React.FC<Props> = ({
  label,
  historyList,
  isDetail,
  setIds,
  isSelect,
  ids,
  index,
  total,
  isSticky,
}) => {
  const timeLineItemStyles = tv({
    slots: {
      base: cn('relative group flex'),
      labelItem: cn('absolute top-0 right-full h-full flex flex-col justify-between'),
      anchorItem: cn('w-8 mr-10 flex flex-col items-center justify-center'),
      contentItem: cn('flex-1 min-h-[calc(16px*2)]'),
      sectionCard: cn('grid-cols-4 grid gap-y-12 gap-x-4 pb-25 group-last-of-type:pb-0 '),
      historyCard: cn('flex relative'),
      historyCardLeft: cn('flex-1'),
      historyCardRight: cn('flex-1 ml-3'),
    },
  })

  const {
    base,
    anchorItem,
    contentItem,
    labelItem,
    historyCard,
    historyCardLeft,
    sectionCard,
    historyCardRight,
  } = timeLineItemStyles()

  const { historyDelete } = useHistoryDeleteBatch()

  const sectionRef = useRef<HTMLElement | null>(null)
  const labelRef = useRef<HTMLDivElement | null>(null)

  const [isFixed, setIsFixed] = useState(false)
  const [type, setType] = useState<'top' | 'bottom' | 'normal'>('normal')
  const [upperBound, setUpperBound] = useState(94 + 36 * index)
  useEffect(() => {
    setUpperBound((isSticky ? 94 + 104 : 94) + 36 * index)
  }, [index, isSticky])

  const lowerBound = 72 + (total - 1 - index) * 32

  const labelOffsetRef = useRef<number | null>(null)
  const labelHeightRef = useRef<number>(0)
  const fixedModeRef = useRef<'top' | 'bottom' | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const compute = () => {
      const s = sectionRef.current
      const l = labelRef.current
      if (!s || !l) return
      const sRect = s.getBoundingClientRect()
      const lRect = l.getBoundingClientRect()
      labelOffsetRef.current = lRect.top - sRect.top
      labelHeightRef.current = lRect.height || l.offsetHeight || 0
    }

    const id = requestAnimationFrame(compute)
    window.addEventListener('resize', compute)
    return () => {
      cancelAnimationFrame(id)
      window.removeEventListener('resize', compute)
    }
  }, [historyList.length])

  useEffect(() => {
    const HYST = 6

    const update = () => {
      rafRef.current = null
      const s = sectionRef.current
      const l = labelRef.current
      if (!s || !l) return

      const rect = s.getBoundingClientRect()
      const viewportH = window.innerHeight

      const offset = labelOffsetRef.current ?? l.getBoundingClientRect().top - rect.top
      const naturalTop = rect.top + (offset ?? 0)
      const labelHeight = labelHeightRef.current || l.getBoundingClientRect().height

      const naturalBottom = naturalTop + labelHeight

      let newFixedMode: 'top' | 'bottom' | null

      if (fixedModeRef.current === 'top') {
        if (naturalTop <= upperBound + HYST) newFixedMode = 'top'
        else newFixedMode = null
      } else if (fixedModeRef.current === 'bottom') {
        if (naturalBottom >= viewportH - lowerBound - HYST) newFixedMode = 'bottom'
        else newFixedMode = null
      } else {
        if (naturalTop <= upperBound - HYST) {
          newFixedMode = 'top'
        } else if (naturalBottom >= viewportH - lowerBound + HYST) {
          newFixedMode = 'bottom'
        } else {
          newFixedMode = null
        }
      }

      const isFixedNew = newFixedMode !== null
      const typeNew =
        newFixedMode === 'top' ? 'top' : newFixedMode === 'bottom' ? 'bottom' : 'normal'

      if (fixedModeRef.current !== newFixedMode) fixedModeRef.current = newFixedMode
      if (isFixedNew !== isFixed) setIsFixed(isFixedNew)
      if (typeNew !== type) setType(typeNew)
    }

    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(update)
    }

    onScroll()

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [upperBound, lowerBound, historyList.length, isFixed, type])

  const styleProps: React.CSSProperties = {
    top: isFixed && type === 'top' ? `${upperBound}px` : undefined,
    bottom: isFixed && type === 'bottom' ? `${lowerBound}px` : undefined,
  }

  const { ref: viewRef, inView } = useInView({
    rootMargin: '0px',
    delay: 200,
  })

  const handleClick = () => {
    if (!sectionRef.current) return
    // 获取当前 section 相对于页面的顶部位置
    const top = sectionRef.current.getBoundingClientRect().top + window.scrollY - 96
    window.scrollTo({
      top,
      behavior: 'smooth', // 平滑滚动
    })
  }

  return (
    <section ref={sectionRef} className={base()}>
      <div className={labelItem()}>
        <div
          ref={labelRef}
          style={styleProps}
          className={cn('text-text2 relative z-99 transition-all duration-300', isFixed && 'fixed')}
        >
          <div
            onClick={handleClick}
            className='hover:text-brand_blue absolute top-0 right-full cursor-pointer text-[16px] leading-[1] font-medium whitespace-nowrap transition-colors duration-300'
          >
            {label}
          </div>
          <div className='absolute top-0 left-4 flex size-4 -translate-x-1/2 items-center justify-center'>
            <div
              className={cn(
                'border-graph_icon bg-bg1_floa size-4 rounded-full border-2 transition-all duration-300',
                !inView && 'size-1'
              )}
            ></div>
          </div>
        </div>
      </div>
      <div className={anchorItem()}>
        <div></div>
        <div className='bg-line_bold w-[2px] flex-1'></div>
      </div>
      <div className={contentItem()}>
        <div ref={viewRef} className={cn(sectionCard(), isDetail && 'grid-cols-1 gap-x-0 gap-y-5')}>
          {historyList.map((item) => (
            <div className={cn(historyCard(), 'history-item')} key={item.videoId}>
              <div className={cn(historyCardLeft(), isDetail && 'w-[178px] flex-initial shrink-0')}>
                <TinyVideoItem
                  video={{
                    id: item.videoId,
                    ...item,
                    views: 0,
                    danmakus: 0,
                    publishedAt: item.watchAt,
                  }}
                  hiddenDanmu
                  hiddenView
                  hiddenTime
                  hiddenPublishAt
                  showProgress
                  showFavorite={!isDetail}
                  disabled
                  showWatchAt={!isDetail}
                  showDeleteBtn={!isDetail}
                  hiddenTitle={isDetail}
                  hiddenUser={isDetail}
                  deleteFn={async () => {
                    const { code } = await historyDelete({ videoIds: [item.videoId] })
                    if (code === 1) return
                    toast('已删除')
                  }}
                />
                {isSelect && <HistoryCheckBox setIds={setIds} id={item.videoId} ids={ids} />}
              </div>
              {isDetail && (
                <div className={historyCardRight()}>
                  <div className='relative'>
                    <Link
                      className='text-text1 hover:text-brand_blue mr-20 line-clamp-2 cursor-pointer text-[16px] leading-6 font-medium transition-colors duration-300'
                      href={`/video/${item.videoId}`}
                      target={'_blank'}
                    >
                      {item.title}
                    </Link>
                    <div className='absolute top-0 right-0 flex h-6 items-center'>
                      {item.isFavorite && (
                        <div className='text-text3 relative mr-1 pr-[9px] text-[13px] shadow-[.5px_0_0_0_var(--line_bold)]'>
                          已收藏
                        </div>
                      )}
                      <div
                        onClick={async () => {
                          const { code } = await historyDelete({ videoIds: [item.videoId] })
                          if (code === 1) return
                          toast('已删除')
                        }}
                        className='text-text2 hover:text-brand_blue flex size-[22px] shrink-0 cursor-pointer items-center justify-center transition-colors duration-300'
                      >
                        <i className='sic-BDC-trash_delete_line pointer-events-none text-[16px]'></i>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Link
                      target={'_blank'}
                      href={`/space/${item.userId}`}
                      className='text-text3 hover:text-brand_blue mt-1.5 flex w-fit items-center text-sm leading-5 transition-colors duration-300'
                    >
                      <i className='sic-BDC-uploader_name_square_line mr-0.5 text-[16px]'></i>
                      <div className='line-clamp-1'>{item.username}</div>
                    </Link>
                    <div className='text-text3 mt-1 flex w-fit items-center text-sm leading-5 transition-colors duration-300'>
                      <i className='sic-BDC-computer_line mr-0.5 text-[16px]'></i>
                      {dayjs(item.watchAt).format('MM-DD H:mm')}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HistoryTimeLineItem
