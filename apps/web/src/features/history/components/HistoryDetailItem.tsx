'use client'

import { VideoGetWaterLaterItem } from '@mtobdvlb/shared-types'
import Link from 'next/link'
import { cn } from '@/lib'
import TinyVideoPlayer from '@/components/layout/video/TinyVideoPlayer'
import { formatPlayCount, formatTime } from '@/utils'
import { useState } from 'react'
import WatchLaterDeleteBtn from '@/features/watch-later/components/WatchLaterDeleteBtn'

const HistoryDetailItem = ({ video }: { video: VideoGetWaterLaterItem }) => {
  const [time, setTime] = useState(0)
  const [hover, setHover] = useState(false)
  return (
    <article className={'relative flex'}>
      <div className={'text-text1 relative min-w-[178px] shrink-0'}>
        <Link
          href={`/apps/web/src/app/(with-auth)/video/${video.id}?t=${time.toFixed(0)}`}
          target={'_blank'}
          className={'block transition-colors duration-200 ease-linear'}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <div className={'relative z-1 overflow-hidden rounded-[6px]'}>
            <div className={'cursor-pointer bg-[#F1F2F3] pt-[56.25%]'}>
              <div
                className={
                  'absolute top-[8px] right-[8px] z-9 flex h-[28px] min-w-[28px] translate-z-0 cursor-pointer items-center justify-end'
                }
              ></div>
              <picture
                className={
                  'bg-graph_bg_regular absolute top-0 left-0 z-1 inline-block h-full w-full overflow-hidden rounded-[6px] object-cover align-middle'
                }
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className={'block size-full overflow-clip'}
                />
              </picture>
              <div
                className={cn(
                  'pointer-events-none absolute top-0 left-0 z-1 size-full overflow-hidden opacity-0 transition-opacity duration-200 ease-linear select-none',
                  hover && 'opacity-100'
                )}
              >
                <div className={'relative size-full scale-[1.01] text-xs'}>
                  <div className={'relative size-full shadow-none'}>
                    <TinyVideoPlayer
                      hiddenTime
                      hover={hover}
                      time={time}
                      setTime={setTime}
                      video={video}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div
              className={cn(
                'pointer-events-none absolute inset-0 z-2 transition-all duration-200 ease-linear',
                hover && 'hidden opacity-0'
              )}
            >
              <div
                className={
                  'absolute bottom-0 left-0 z-2 flex h-[38px] w-full items-center justify-between rounded-b-[6px] bg-gradient-to-b from-black/0 to-black/80 px-[8px] pt-[16px] pb-[6px] text-[13px] leading-[18px] text-white opacity-100'
                }
              >
                <div className={'flex min-w-0 flex-1 items-center justify-start'}></div>
                <span className={'rounded-[4px] bg-black/30 px-1 py-[1px] text-white'}>
                  {formatTime(video.time)}
                </span>
              </div>
            </div>
          </div>
        </Link>
      </div>
      <div className={'ml-3 flex flex-1 flex-col'}>
        <Link
          className={
            'text-text1 hover:text-brand_blue mb-2 line-clamp-1 w-fit max-w-[calc(100%-54px)] cursor-pointer overflow-hidden text-[16px] leading-[22px] font-medium transition-colors duration-300'
          }
          href={`/apps/web/src/app/(with-auth)/video/${video.id}`}
          target={'_blank'}
        >
          {video.title}
        </Link>
        <div className={'mb-1 flex items-center'}>
          <Link
            className={
              'text-text3 hover:text-brand_blue mr-5 flex cursor-pointer items-center text-sm'
            }
            href={`/apps/web/src/app/(with-auth)/space/${video.userId}`}
            target={'_blank'}
          >
            <i
              className={
                'sic-BDC-uploader_name_square_line mr-0.5 inline-block align-baseline text-[18px] leading-[1] font-normal'
              }
            ></i>
            {video.username}
          </Link>
        </div>
        <div>
          <div className={'mb-1 flex items-center'}>
            <div className={'text-text3 mr-5 flex items-center text-sm'}>
              <i
                className={
                  'sic-BDC-playdata_square_line mr-0.5 inline-block align-baseline text-[18px] leading-[1] font-normal'
                }
              ></i>
              {formatPlayCount(video.views)}
            </div>
            <div className={'text-text3 mr-5 flex items-center text-sm'}>
              <i
                className={
                  'sic-BDC-danmu_square_line mr-0.5 inline-block align-baseline text-[18px] leading-[1] font-normal'
                }
              ></i>
              {formatPlayCount(video.danmakus)}
            </div>
          </div>
        </div>
        <WatchLaterDeleteBtn favoriteId={video.favoriteId} className={'inset-y-0 right-0'} />
      </div>
    </article>
  )
}

export default HistoryDetailItem
