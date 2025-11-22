'use client'

import Link from 'next/link'
import { cn } from '@/lib'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components'
import { VideoListItem } from '@mtobdvlb/shared-types'
import { useFavoriteWatchLaterToggle, useIsWatchLater } from '@/features'
import { useEffect, useState } from 'react'
import { useCountdownClose } from '@/hooks'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'

const VideoEndItem = ({
  video,
  isAutoPlayNext,
}: {
  video: VideoListItem

  isAutoPlayNext: boolean
}) => {
  const router = useRouter()
  const { favoriteWatchLaterToggle } = useFavoriteWatchLaterToggle(video.id)
  const { isFavorite } = useIsWatchLater(video.id)
  const [open, setOpen] = useState(false)
  const { countdown } = useCountdownClose(open, setOpen, {
    onComplete: () => {
      router.push(`/video/${video.id}`)
    },
    duration: 5,
    interval: 0.01,
  })

  useEffect(() => {
    if (isAutoPlayNext) {
      setOpen(true)
    } else {
      setOpen(false)
    }
  }, [isAutoPlayNext])

  const r = 42
  const k = r * 0.552284749831 // 贝塞尔控制点常数

  const fullCircleD = `
M0,-${r}
C${k},-${r} ${r},-${k} ${r},0
C${r},${k} ${k},${r} 0,${r}
C-${k},${r} -${r},${k} -${r},0
C-${r},-${k} -${k},-${r} 0,-${r}
`

  return (
    <Link
      href={`/video/${video.id}`}
      className={cn(
        'border rounded-[4px] border-transparent ',
        ' float-left h-[140px] mb-4 mr-4 overflow-hidden pointer-events-auto hover:border-white hover:shadow-[0_0_6px] ',
        ' hover:shadow-white/50 relative transition-all duration-300 ease-in-out w-[223px] group'
      )}
    >
      <div
        className={cn(
          'bg-[linear-gradient(transparent,rgba(0,0,0,.1)_20%,rgba(0,0,0,.2)_35%,rgba(0,0,0,.5)_65%,rgba(0,0,0,.66))] rounded-[4px] absolute top-1/3 z-1 inset-x-0 bottom-0'
        )}
      ></div>
      <div
        className={
          'bg-black bg-center bg-no-repeat bg-[auto_100%] rounded-[4px] h-full overflow-hidden relative transition-all duration-300 ease-in-out w-full'
        }
        style={{
          backgroundImage: `url(${video.thumbnail})`,
        }}
      ></div>
      <div
        className={
          'rounded-[4px] text-white cursor-pointer inset-0 absolute z-2 transition-all duration-300 ease-in-out '
        }
      >
        <div
          className={
            'text-[13px] leading-4.5 h-4.5 overflow-hidden xp-2.5 absolute group-hover:whitespace-normal text-ellipsis top-[118px] transition-transform duration-300 ease-in-out whitespace-nowrap w-full z-1 break-all group-hover:line-clamp-2 group-hover:h-auto group-hover:pr-6 group-hover:-translate-y-4.5 '
          }
        >
          {video.title}
        </div>
        <div
          className={
            'bg-black/80 bottom-[calc(100%-30px)] h-7 right-3.5 rounded-[4px] -mb-1.5 -mr-1 opacity-0 absolute transition-opacity duration-200 ease-in invisible z-2 group-hover:opacity-100 group-hover:visible'
          }
          onClick={async (e) => {
            e.preventDefault()
            await favoriteWatchLaterToggle()
          }}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <i
                className={cn(
                  'size-7 text-[22px]  cursor-pointer inline-block rounded-[6px] bg-[auto_100%] bg-[url(/images/video-watch-later.png)]',
                  isFavorite && 'bg-[url(/images/video-watch-later-yes.png)]'
                )}
              ></i>
            </TooltipTrigger>
            <TooltipContent>{isFavorite ? '移除' : '稍后再看'}</TooltipContent>
          </Tooltip>
        </div>
        <div
          className={cn(
            'right-[calc(100%-75px)] top-2 bg-white/40 rounded-[4px] text-white cursor-pointer text-sm h-6 leading-6 absolute text-center w-[68px] z-11',
            !open && 'hidden'
          )}
          onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
            setOpen(false)
          }}
        >
          取消连播
        </div>
        <div className={cn('ml-[50%]  mt-10 -translate-x-1/2 w-16', !open && 'hidden')}>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 312 312'
            width='312'
            height='312'
            preserveAspectRatio='xMidYMid meet'
            className={'size-full transform-gpu'}
          >
            <defs>
              <clipPath id='__lottie_element_721'>
                <rect width='312' height='312' x='0' y='0'></rect>
              </clipPath>
            </defs>
            <g clipPath='url(#__lottie_element_721)'>
              <g transform='matrix(1,0,0,1,156,156)' opacity='1' className={'block'}>
                <g opacity='1' transform='matrix(3,0,0,3,0,0)'>
                  <path
                    fill='rgb(255,255,255)'
                    fillOpacity='0.3'
                    d=' M0,-39 C21.524099349975586,-39 39,-21.524099349975586 39,0 C39,21.524099349975586 21.524099349975586,39 0,39 C-21.524099349975586,39 -39,21.524099349975586 -39,0 C-39,-21.524099349975586 -21.524099349975586,-39 0,-39z'
                  ></path>
                </g>
              </g>
              <g
                transform='matrix(1,0,0,1,160.16299438476562,155.85499572753906)'
                opacity='1'
                style={{ display: 'block' }}
              >
                <g opacity='1' transform='matrix(3,0,0,3,0,0)'>
                  <path
                    fill='rgb(255,255,255)'
                    fillOpacity='1'
                    d=' M16.879465103149414,-2.295045852661133 C18.927309036254883,-1.0273061990737915 18.927309036254883,1.031306266784668 16.879465103149414,2.2990458011627197 C16.879465103149414,2.2990458011627197 -12.949463844299316,20.76495361328125 -12.949463844299316,20.76495361328125 C-14.997308731079102,22.03269386291504 -16.65999984741211,21.106491088867188 -16.65999984741211,18.697999954223633 C-16.65999984741211,18.697999954223633 -16.65999984741211,-18.694000244140625 -16.65999984741211,-18.694000244140625 C-16.65999984741211,-21.10249137878418 -14.997308731079102,-22.02869415283203 -12.949463844299316,-20.760953903198242 C-12.949463844299316,-20.760953903198242 16.879465103149414,-2.295045852661133 16.879465103149414,-2.295045852661133z'
                  ></path>
                </g>
              </g>
              <g transform='matrix(1,0,0,1,156,156)' opacity='0.4' className={'block'}>
                <g opacity='1' transform='matrix(3,0,0,3,0,0)'>
                  <path
                    strokeLinecap='butt'
                    strokeLinejoin='miter'
                    fillOpacity='0'
                    strokeMiterlimit='4'
                    stroke='rgb(0,0,0)'
                    strokeOpacity='1'
                    strokeWidth='6'
                    d=' M0,-42 C23.179800033569336,-42 42,-23.179800033569336 42,0 C42,23.179800033569336 23.179800033569336,42 0,42 C-23.179800033569336,42 -42,23.179800033569336 -42,0 C-42,-23.179800033569336 -23.179800033569336,-42 0,-42z'
                  ></path>
                </g>
              </g>
              <g transform='matrix(1,0,0,1,156,156)' opacity='1' className={'block'}>
                <g opacity='1' transform='matrix(3,0,0,3,0,0)'>
                  <motion.path
                    strokeLinecap='round'
                    strokeLinejoin='miter'
                    fillOpacity={0}
                    strokeMiterlimit={4}
                    stroke='white'
                    strokeWidth={6}
                    d={fullCircleD}
                    strokeDasharray={264} // 2πr ≈ 2*3.1416*42
                    strokeDashoffset={264 * (countdown / 5)}
                    style={{
                      transformOrigin: '0 0', // 仍然左上角或改成圆心
                      transform: 'rotate(0deg)',
                    }}
                    transition={{ duration: 0.01, ease: 'linear' }}
                  />
                </g>
              </g>
            </g>
          </svg>
        </div>
      </div>
    </Link>
  )
}

export default VideoEndItem
