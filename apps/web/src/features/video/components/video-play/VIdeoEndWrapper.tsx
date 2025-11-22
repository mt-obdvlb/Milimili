'use client'
import { cn } from '@/lib'
import Link from 'next/link'
import Image from 'next/image'
import FollowBtn from '@/components/ui/follow-btn'
import VideoToolbar from '@/features/video/components/VideoToolbar'
import { tv } from 'tailwind-variants'
import { useVideoContext, useVideoList } from '@/features'
import { VideoGetDetail } from '@mtobdvlb/shared-types'
import VideoEndItem from '@/features/video/components/video-play/VideoEndItem'

const VIdeoEndWrapper = ({
  videoDetail,
  isAutoPlayNext,
}: {
  videoDetail: VideoGetDetail
  isAutoPlayNext: boolean
}) => {
  const { isEnded, seek, play } = useVideoContext()
  const { videoRecommendList } = useVideoList()
  const { end } = tv({
    slots: {
      end: cn(
        ' invisible transition-[opacity_.2s_linear,visibility_0ms_.2s] opacity-0',
        isEnded && 'opacity-100 visible'
      ),
    },
  })()
  return (
    <div className={cn(end(), 'overflow-hidden absolute inset-0 z-55 ')}>
      <div
        className={cn(
          end(),
          '-z-1 w-6/5 -top-1/10 absolute -left-1/10 h-6/5 blur-[20px] bg-cover bg-center'
        )}
      >
        <span className={'absolute inset-0 bg-black/6'}></span>
      </div>
      <div className={cn(end(), 'z-1 absolute inset-0')}>
        <div className={'size-full overflow-hidden cursor-pointer'}>
          <div
            className={
              'scale-85 text-white cursor-default h-[390px] left-1/2 top-1/2 w-[710px] z-2 absolute pointer-events-none -mt-[195px] -ml-[355px]'
            }
          >
            <div className={'flex w-full'}>
              <div
                className={
                  'border-2 border-white/60 rounded-full size-[56px] -m-[2px] pointer-events-auto hover:border-brand_blue'
                }
              >
                <Link
                  href={`/space/${videoDetail.user.id}`}
                  target={'_blank'}
                  className={'rounded-full overflow-hidden block size-full'}
                >
                  <Image
                    src={videoDetail.user.avatar}
                    alt={videoDetail.user.name}
                    width={48}
                    height={48}
                    className={'size-full rounded-full'}
                  />
                </Link>
              </div>
              <div
                className={
                  'flex flex-col h-[56px] justify-between pointer-events-auto ml-5 max-w-[300px] min-w-[130px] relative'
                }
              >
                <div
                  className={
                    'text-white text-[16px] h-5 leading-4  text-ellipsis w-full whitespace-nowrap'
                  }
                >
                  <Link
                    href={`/space/${videoDetail.user.id}`}
                    target={'_blank'}
                    className={
                      'hover:text-shadow-[0_0_4px] hover:text-shadow-white transition-all  duration-300 ease-linear'
                    }
                  >
                    {videoDetail.user.name}
                  </Link>
                </div>
                <div className={'flex'}>
                  <FollowBtn
                    followingId={videoDetail.user.id}
                    className={'rounded-[4px] h-[30px] px-[21px] py-0 w-auto ml-0'}
                  />
                </div>
              </div>
              <div className={'flex grow h-[56px] justify-end items-end'}>
                <div
                  className={
                    'border-r border-r-white/10 pr-[30px] fill-white/90 text-white/90 cursor-pointer flex flex-col h-[46px] justify-between pointer-events-auto text-center transition-all duration-300 ease-linear hover:fill-white hover:text-white'
                  }
                  onClick={() => {
                    seek(0)
                    play()
                  }}
                >
                  <span className={'size-7 pointer-events-none'}>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      data-pointer='none'
                      viewBox='0 0 28 28'
                      className={'size-full transform-fill duration-150 ease-in-out '}
                    >
                      <path
                        fill='#fff'
                        d='M14.158 6.212c-4.404 0-8.06 3.656-8.06 8.06s3.656 8.06 8.06 8.06c2.806 0 5.318-1.414 6.859-3.717.195-.392.708-.734 1.132-.734.765 0 1.413.594 1.413 1.413 0 .171-.033.307-.093.458a.605.605 0 0 0-.021.145l-.079.123c-1.981 3.096-5.382 5.026-9.096 5.026A10.728 10.728 0 0 1 3.5 14.273 10.73 10.73 0 0 1 14.273 3.5c2.591 0 5.021.919 6.921 2.532v-.549c0-.733.564-1.299 1.297-1.299a1.28 1.28 0 0 1 1.299 1.299v3.996a1.28 1.28 0 0 1-1.299 1.299h-3.996a1.278 1.278 0 0 1-1.297-1.299c0-.783.472-1.413 1.297-1.413h.787c-1.46-1.179-3.26-1.854-5.124-1.854z'
                      ></path>
                    </svg>
                  </span>
                  重播
                </div>
                <div
                  className={
                    'flex justify-between ml-[30px]  h-full items-center pointer-events-auto'
                  }
                >
                  <VideoToolbar
                    videoDetail={videoDetail}
                    className={cn(
                      'text-white/90 fill-white/90 hover:text-white/90 hover:fill-white/90'
                    )}
                  />
                </div>
              </div>
            </div>
            <div className={'h-[306px] -mr-7 mt-5 overflow-hidden relative'}>
              {videoRecommendList?.slice(1, 7).map((item, index) => (
                <VideoEndItem
                  isAutoPlayNext={index === 0 && isAutoPlayNext && isEnded}
                  key={index}
                  video={item}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VIdeoEndWrapper
