'use client'

import { cn, toast } from '@/lib'
import { formatPlayCount } from '@/utils'
import { useVideoShare } from '@/features'
import { VideoGetDetail } from '@mtobdvlb/shared-types'
import { HoverCard, HoverCardTrigger } from '@/components'
import { motion } from 'motion/react'
import { useState } from 'react'

const VideoShare = ({ videoDetail }: { videoDetail: VideoGetDetail }) => {
  const { shareVideo } = useVideoShare()
  const [isHover, setIsHover] = useState(false)

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div
          className='relative mr-2'
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
        >
          <div
            className={cn(
              'relative flex items-center   transition-all duration-300 text-[13px] text-text2 font-medium cursor-pointer',
              isHover && 'text-brand_blue'
            )}
            onClick={async () => {
              await shareVideo({ videoId: videoDetail.video.id })

              const currentUrl = window.location.href
              await navigator.clipboard.writeText(currentUrl)

              toast('视频链接已复制到剪切板')
            }}
          >
            <svg
              width='28'
              height='28'
              viewBox='0 0 28 28'
              xmlns='http://www.w3.org/2000/svg'
              className={'size-7 mr-2'}
            >
              <path
                d='M12.6058 10.3326V5.44359C12.6058 4.64632 13.2718 4 14.0934 4C14.4423 4 14.78 4.11895 15.0476 4.33606L25.3847 12.7221C26.112 13.3121 26.2087 14.3626 25.6007 15.0684C25.5352 15.1443 25.463 15.2144 25.3847 15.2779L15.0476 23.6639C14.4173 24.1753 13.4791 24.094 12.9521 23.4823C12.7283 23.2226 12.6058 22.8949 12.6058 22.5564V18.053C7.59502 18.053 5.37116 19.9116 2.57197 23.5251C2.47607 23.6489 2.00031 23.7769 2.00031 23.2122C2.00031 16.2165 3.90102 10.3326 12.6058 10.3326Z'
                fill='currentColor'
              />
            </svg>

            <div className='relative w-[90px] h-7 leading-7 overflow-hidden text-ellipsis break-words whitespace-nowrap'>
              {/* 默认显示的文字 */}
              <motion.span
                animate={{ y: isHover ? '-100%' : '0%' }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className='block'
              >
                {videoDetail.video.shares ? formatPlayCount(videoDetail.video.shares) : '转发'}
              </motion.span>
              {/* Hover 时出现的文字 */}(
              <motion.span
                initial={{ y: '100%' }}
                animate={{ y: isHover ? '0%' : '100%' }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className='absolute top-0 left-0 block'
              >
                点击复制链接
              </motion.span>
              )
            </div>
          </div>
        </div>
      </HoverCardTrigger>
    </HoverCard>
  )
}

export default VideoShare
