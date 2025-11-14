'use client'
import { useFeedGetList } from '@/features'
import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { formatPlayCount } from '@/utils'
import { useInfiniteScroll } from '@/hooks'

const GAP = 16
const COLUMNS = 5

interface ItemPosition {
  top: number
  left: number
  height: number
}

const SpaceUploadFeedList = ({ userId }: { userId: string }) => {
  const { feedList: rawFeedList, fetchNextPage } = useFeedGetList({
    userId,
    type: 'image-text',
    pageSize: 50,
  })
  const { ref: fetchRef } = useInfiniteScroll(fetchNextPage)
  const containerRef = useRef<HTMLDivElement>(null)
  const [itemWidth, setItemWidth] = useState(0)
  const [positions, setPositions] = useState<ItemPosition[]>([])
  const [containerHeight, setContainerHeight] = useState(0)
  const [imageHeights, setImageHeights] = useState<Record<string, number>>({})

  const feedList = useMemo(() => rawFeedList.filter((item) => !!item.images?.length), [rawFeedList])

  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new ResizeObserver(() => {
      const w = Math.max((container.offsetWidth - GAP * (COLUMNS - 1)) / COLUMNS, 200)
      setItemWidth(w)
    })
    observer.observe(container)

    return () => observer.disconnect()
  }, [])

  const calculateLayout = () => {
    if (!itemWidth || !feedList.length) return
    const columnHeights = new Array(COLUMNS).fill(0)
    const pos: ItemPosition[] = []

    feedList.forEach((item) => {
      const col = columnHeights.indexOf(Math.min(...columnHeights))
      const left = col * (itemWidth + GAP)
      const top = columnHeights[col]
      const imageHeight = imageHeights[item.id] ?? itemWidth * 0.56
      const textHeight = 40
      const totalHeight = imageHeight + textHeight + 10
      pos.push({ top, left, height: totalHeight })
      columnHeights[col] += totalHeight + GAP
    })

    setPositions(pos)
    setContainerHeight(Math.max(...columnHeights))
  }

  useLayoutEffect(() => {
    calculateLayout()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemWidth, Object.keys(imageHeights).length, feedList.length])

  // ✅ 图片加载后更新高度（仅在高度改变时）
  const handleImageLoad = (id: string, e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget
    const ratio = img.naturalHeight / img.naturalWidth
    const height = itemWidth * ratio

    setImageHeights((prev) => {
      if (prev[id] === height) return prev // 避免重复更新
      return { ...prev, [id]: height }
    })
  }

  return (
    <div
      className='mt-[30px] w-full relative transition-all'
      ref={containerRef}
      style={{ height: containerHeight }}
    >
      {feedList.map((item, index) => {
        const { top, left } = positions[index] || { top: 0, left: 0 }
        const imgHeight = imageHeights[item.id] ?? itemWidth * 0.56

        return (
          <div
            key={item.id}
            className='absolute rounded-md  overflow-hidden transition-all'
            style={{ width: itemWidth, left, top }}
            ref={index === feedList.length - 1 ? fetchRef : null}
          >
            <Link
              target={'_blank'}
              className={'relative w-full rounded-[6px]'}
              href={`/apps/web/src/app/(with-auth)/feed/${item.id}`}
            >
              <div className={'rounded-[6px] size-full'}>
                <Image
                  width={itemWidth}
                  height={imgHeight}
                  src={item.images?.[0] ?? ''}
                  alt=''
                  className='w-full object-cover rounded-[6px]'
                  style={{ height: imgHeight }}
                  onLoad={(e) => handleImageLoad(item.id, e)}
                />
              </div>
              <div
                className={
                  'absolute bottom-0 left-0 z-2 w-full px-2 pt-3.5 pb-1 rounded-b-[6px] bg-[linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,.8))] text-white opacity-100 flex items-center justify-between pointer-events-none transition-all duration-200'
                }
              >
                <div
                  className={
                    'flex items-center justify-center mr-3 text-[18px] shrink-0 h-4.5 leading-[1]'
                  }
                >
                  <i
                    className={'sic-BDC-hand_thumbsup_line mr-0.5 size-4 font-normal text-[16px]'}
                  ></i>
                  <span className={'text-xs'}>{formatPlayCount(item.likes)}</span>
                </div>
              </div>
            </Link>
            <Link
              target={'_blank'}
              href={`/apps/web/src/app/(with-auth)/feed/${item.id}`}
              className='line-clamp-2 text-ellipsis block text-sm py-1.5 text-text1 transition-all duration-300 hover:text-brand_blue'
            >
              {item.content}
            </Link>
          </div>
        )
      })}
    </div>
  )
}

export default SpaceUploadFeedList
