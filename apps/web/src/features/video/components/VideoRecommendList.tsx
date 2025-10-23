import { useVideoList } from '@/features'
import { Label, Separator } from '@/components'
import { Switch } from '@/components/ui/switch'
import VideoTinyItemTypeTwo from '@/features/video/components/VideoTinyItemTypeTwo'
import { useEffect, useRef, useState } from 'react'

const VideoRecommendList = () => {
  const { videoRecommendList } = useVideoList(20)
  const [isShow, setIsShow] = useState(false)
  const [maxHeight, setMaxHeight] = useState('0px')
  const hiddenRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (hiddenRef.current) {
      setMaxHeight(isShow ? `${hiddenRef.current.scrollHeight}px` : '0px')
    }
  }, [isShow])

  if (!videoRecommendList || !videoRecommendList[0]) return null

  return (
    <div className={'mt-4.5 pointer-events-auto'}>
      <div className={''}>
        <div className={'flex items-center justify-between mb-3'}>
          <div className={'text-[15px] font-medium text-text1'}>接下来播放</div>
          <Label className={'cursor-pointer flex items-center'}>
            <div className={'text-text3 text-[14px] mr-1'}>自动连播</div>
            <Switch />
          </Label>
        </div>
        <div className={'mb-3'}>
          <VideoTinyItemTypeTwo video={videoRecommendList[0]} />
        </div>
        <Separator
          orientation={'horizontal'}
          className={'h-[1px] w-full m-0 p-0 bg-line_regular'}
        />
      </div>

      {/* 前 9 个视频 */}
      <div className={'mt-4.5 transition-all duration-200'}>
        {videoRecommendList.slice(1, 10).map((video, index) => (
          <div key={video.id + index} className={'mb-3'}>
            <VideoTinyItemTypeTwo video={video} />
          </div>
        ))}

        {/* 可展开内容 */}
        <div
          ref={hiddenRef}
          className='overflow-hidden transition-all duration-300'
          style={{ maxHeight }}
        >
          {videoRecommendList.slice(10).map((video, index) => (
            <div key={video.id + 10 + index} className={'mb-3'}>
              <VideoTinyItemTypeTwo video={video} />
            </div>
          ))}
        </div>
      </div>

      <div
        className={
          'h-[42px] bg-graph_bg_regular hover:bg-graph_bg_thick text-xs text-text1 mt-2.5 text-center leading-[42px] cursor-pointer rounded-[6px] select-none transition-colors duration-300'
        }
        onClick={() => setIsShow(!isShow)}
      >
        {isShow ? '收起' : '展开'}
      </div>
    </div>
  )
}

export default VideoRecommendList
