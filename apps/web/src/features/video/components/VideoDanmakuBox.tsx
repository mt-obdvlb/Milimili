'use client'
import { useEffect, useRef, useState } from 'react'
import VideoDanmakuTable from '@/features/video/components/VideoDanmakuTable'

const VideoDanmakuBox = ({ videoId }: { videoId: string }) => {
  const [isExpand, setIsExpand] = useState(false)
  const [height, setHeight] = useState('0px')

  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!listRef.current) return
    if (isExpand) {
      // 展开: 设置成 scrollHeight，动态高度
      setHeight(`${listRef.current.scrollHeight}px`)
    } else {
      // 收起: 高度为 0
      setHeight('0px')
    }
  }, [isExpand])

  return (
    <div
      className={
        'min-h-11 mt-0 mb-4.5 relative pointer-events-auto rounded-[6px] bg-white flex select-none'
      }
    >
      <div className={'w-full'}>
        <div
          className={
            'rounded-[6px] flex items-center align-middle bg-[#f4f4f4] text-[#222] cursor-pointer  relative'
          }
          onClick={() => setIsExpand(!isExpand)}
        >
          <div className={'absolute flex items-center align-middle top-0 right-4 bottom-0 m-auto'}>
            <span className={'inline-flex text-xs text-[#222] cursor-pointer'}>
              <span
                style={{
                  transform: isExpand ? 'rotate(270deg)' : 'rotate(90deg)',
                }}
                className={'fill-[#757575] size-4 transition duration-300'}
              >
                <svg xmlns='http://www.w3.org/2000/svg' data-pointer='none' viewBox='0 0 16 16'>
                  <path d='m9.188 7.999-3.359 3.359a.75.75 0 1 0 1.061 1.061l3.889-3.889a.75.75 0 0 0 0-1.061L6.89 3.58a.75.75 0 1 0-1.061 1.061l3.359 3.358z'></path>
                </svg>
              </span>
            </span>
          </div>
          <div
            className={
              'rounded-[6px] text-[15px] font-medium h-11 leading-11 flex z-2 relative pr-2.5 pl-4 select-none'
            }
          >
            <span>弹幕列表</span>
          </div>
        </div>
        <div
          ref={listRef}
          className={'relative bg-white transition-[height] w-full duration-300 overflow-hidden '}
          style={{ height }}
        >
          <VideoDanmakuTable videoId={videoId} />
        </div>
      </div>
    </div>
  )
}

export default VideoDanmakuBox
