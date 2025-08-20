import { tv } from 'tailwind-variants'
import { VideoListItem } from '@/types/video'
import { useEffect, useRef, useState } from 'react'
import { formatTime } from '@/utils'

const MainVideoPlayer = ({
  video,
  hover,
  setTime,
  time: currentTime,
}: {
  video: VideoListItem
  hover: boolean
  setTime: (time: number) => void
  time: number
}) => {
  const player = tv({
    slots: {
      base: 'flex size-full flex-col flex-nowrap ',
      perch: 'flex items-center relative size-full justify-center',
      dm: 'contain-paint cursor-pointer size-full absolute left-0 overflow-hidden pointer-events-none mask-center top-0 z-2 select-none',
      time: 'absolute z-75 w-full bottom-0 left-0',
    },
  })

  const videoRef = useRef<HTMLVideoElement>(null)
  const hoverTimeout = useRef<NodeJS.Timeout>(null)

  const [isPlay, setIsPlay] = useState(false)

  useEffect(() => {
    if (!videoRef.current) return
    if (hover) {
      if (!isPlay) setIsPlay(true)
      hoverTimeout.current = setTimeout(() => {
        void videoRef.current?.play()
      }, 200)
    } else {
      videoRef.current.pause()
      if (hoverTimeout.current) clearTimeout(hoverTimeout.current)
      setTime(videoRef.current.currentTime >= 3 ? videoRef.current.currentTime : 0)
    }
  }, [hover, videoRef, setTime, isPlay])

  const { base, perch, dm, time } = player()
  return (
    <div className={base()}>
      <div className={perch()}>
        <div className={'size-full overflow-hidden'}>
          <video
            onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
            src={video.url}
            ref={videoRef}
            autoPlay
            muted
            loop
          />
        </div>
      </div>
      <div className={dm()}></div>
      <div className={time()}>
        <div
          className={
            'pointer-events-none absolute right-[8px] bottom-[10px] z-2 flex items-center justify-center text-[13px] text-white text-shadow-[0_0_3px_rgba(0,0,0,0.6)]'
          }
        >
          <div>{formatTime(+currentTime.toFixed(0))}</div>
          <div>/</div>
          <div>{formatTime(video.time)}</div>
        </div>
      </div>
    </div>
  )
}

export default MainVideoPlayer
