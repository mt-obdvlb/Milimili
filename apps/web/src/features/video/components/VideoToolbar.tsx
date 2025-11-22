import { VideoGetDetail } from '@mtobdvlb/shared-types'
import { formatPlayCount } from '@/utils'
import { cn } from '@/lib'
import { useLike, useLikeGet } from '@/features'
import { cloneElement } from 'react'
import VideoFavorite from '@/features/video/components/VideoFavorite'
import VideoShare from '@/features/video/components/VideoShare'

const VideoToolbar = ({
  videoDetail,
  className,
}: {
  videoDetail: VideoGetDetail
  className?: string
}) => {
  const { unlike, like } = useLike({ videoId: videoDetail.video.id })
  const { isLike } = useLikeGet({ videoId: videoDetail.video.id })

  return (
    <div className={'relative flex items-center select-none'}>
      {[
        {
          svg: (
            <svg width='36' height='36' viewBox='0 0 36 36' xmlns='http://www.w3.org/2000/svg'>
              <path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M9.77234 30.8573V11.7471H7.54573C5.50932 11.7471 3.85742 13.3931 3.85742 15.425V27.1794C3.85742 29.2112 5.50932 30.8573 7.54573 30.8573H9.77234ZM11.9902 30.8573V11.7054C14.9897 10.627 16.6942 7.8853 17.1055 3.33591C17.2666 1.55463 18.9633 0.814421 20.5803 1.59505C22.1847 2.36964 23.243 4.32583 23.243 6.93947C23.243 8.50265 23.0478 10.1054 22.6582 11.7471H29.7324C31.7739 11.7471 33.4289 13.402 33.4289 15.4435C33.4289 15.7416 33.3928 16.0386 33.3215 16.328L30.9883 25.7957C30.2558 28.7683 27.5894 30.8573 24.528 30.8573H11.9911H11.9902Z'
                fill='currentColor'
              ></path>
            </svg>
          ),
          title: videoDetail.video.likes ? formatPlayCount(videoDetail.video.likes) : '点赞',
          className: cn(isLike && 'text-brand_blue hover:text-brand_blue'),
          onClick: async () => {
            if (isLike) {
              await unlike()
            } else {
              await like()
            }
          },
        },
      ].map((item, index) => (
        <div key={index} className={'relative mr-2'}>
          <div
            className={cn(
              'relative flex hover:text-brand_blue items-center w-[92px] whitespace-nowrap transition-all duration-300 text-[13px] text-text2 font-medium cursor-pointer',
              className,
              item.className
            )}
            onClick={item.onClick}
          >
            {cloneElement(item.svg, { className: cn('mr-2 shrink-0 size-7') })}
            <span className={'overflow-hidden text-ellipsis break-words whitespace-nowrap'}>
              {item.title}
            </span>
          </div>
        </div>
      ))}
      <VideoFavorite videoDetail={videoDetail} className={className} />
      <VideoShare videoDetail={videoDetail} className={className} />
    </div>
  )
}

export default VideoToolbar
