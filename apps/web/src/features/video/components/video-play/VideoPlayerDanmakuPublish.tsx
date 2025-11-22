'use client'
import { Button, HoverCard, HoverCardContent, HoverCardTrigger, Input } from '@/components'
import { useDanmakuAdd } from '@/features'
import { cn } from '@/lib'
import { RefObject, useState } from 'react'
import { DanmakuPosition } from '@mtobdvlb/shared-types'

const VideoPlayerDanmakuPublish = ({
  videoId,
  showDanmaku,
  containerClassName,
  videoRef,
}: {
  videoId: string
  showDanmaku: boolean
  containerClassName?: string
  videoRef: RefObject<HTMLVideoElement | null>
}) => {
  const { danmakuAdd } = useDanmakuAdd()

  const [selectColor, setSelectColor] = useState('#FFFFFF')
  const [inputColor, setInputColor] = useState('#FFFFFF')
  const [input, setInput] = useState('')
  const [position, setPosition] = useState<DanmakuPosition>('scroll')

  const validateColor = (color: string) => {
    const hexRegex = /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/
    return hexRegex.test(color)
  }

  const handleDanmaku = async () => {
    const video = videoRef.current
    if (!input.trim() || !video) return
    await danmakuAdd({
      videoId,
      content: input,
      color: selectColor,
      time: video.currentTime,
      position,
    })
    setInput('')
  }

  const colors = [
    '#FE0302',
    '#FF7204',
    '#FFAA02',
    '#FFD302',
    '#FFFF00',
    '#A0EE00',
    '#00CD00',
    '#019899',
    '#4266BE',
    '#89D5FF',
    '#CC0273',
    '#222222',
    '#9B9B9B',
    '#FFFFFF',
  ]

  return (
    <div
      className={cn(
        'rounded-[8px] h-8 ml-2 min-w-[300px] w-[calc(100%-72px)] items-center flex relative bg-[#f4f4f4] text-[#999] grow box-border!',
        containerClassName
      )}
    >
      <div
        className={
          'rounded-t-[8px] rounded-l-[8px] h-full flex-1 w-[200px] flex items-center relative box-border!'
        }
      >
        {showDanmaku && (
          <HoverCard openDelay={50}>
            <HoverCardTrigger>
              <div
                className={
                  'fill-[#757575 text-[hsla(0,0%,100%,.8)] cursor-pointer h-[30px] leading-[30px] py-[3px] relative text-center w-[30px]'
                }
              >
                <span
                  className={
                    'h-full inline-flex items-center fill-[#757575] text-[hsla(0,0%,100%,.8)] cursor-pointer leading-[30px] text-center hover:fill-brand_blue'
                  }
                >
                  <span className={'h-6 w-9 select-none'}>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      data-pointer='none'
                      viewBox='0 0 22 22'
                      className={'size-full transition-all duration-150'}
                    >
                      <path d='M17 16H5c-.55 0-1 .45-1 1s.45 1 1 1h12c.55 0 1-.45 1-1s-.45-1-1-1zM6.96 15c.39 0 .74-.24.89-.6l.65-1.6h5l.66 1.6c.15.36.5.6.89.6.69 0 1.15-.71.88-1.34l-3.88-8.97C11.87 4.27 11.46 4 11 4s-.87.27-1.05.69l-3.88 8.97c-.27.63.2 1.34.89 1.34zM11 5.98 12.87 11H9.13L11 5.98z'></path>
                    </svg>
                  </span>
                </span>
              </div>
            </HoverCardTrigger>
            <HoverCardContent
              className={
                'bg-[hsla(0,0%,8%,.9)] border-none rounded-[2px]  h-auto -ml-[108px] pt-[2px] w-[216px] z-1001 select-none'
              }
              side={'top'}
            >
              <div className={'relative'}>
                <div className={'text-xs leading-5.5 my-2.5 mx-5 min-h-5.5 relative w-[176px]'}>
                  <div className={'text-white leading-4 text-left'}>模式</div>
                  <div className={'flex flex-wrap mt-2 -mr-2'}>
                    {[
                      {
                        value: 'scroll',
                        label: '滚动',
                        icon: (
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            data-pointer='none'
                            viewBox='0 0 28 28'
                          >
                            <path d='M23 3H5a4 4 0 0 0-4 4v14a4 4 0 0 0 4 4h18a4 4 0 0 0 4-4V7a4 4 0 0 0-4-4zM11 9h6a1 1 0 0 1 0 2h-6a1 1 0 0 1 0-2zm-3 2H6V9h2v2zm4 4h-2v-2h2v2zm9 0h-6a1 1 0 0 1 0-2h6a1 1 0 0 1 0 2z'></path>
                          </svg>
                        ),
                      },
                      {
                        value: 'top',
                        label: '顶部',
                        icon: (
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            data-pointer='none'
                            viewBox='0 0 28 28'
                          >
                            <path d='M23 3H5a4 4 0 0 0-4 4v14a4 4 0 0 0 4 4h18a4 4 0 0 0 4-4V7a4 4 0 0 0-4-4zM9 9H7V7h2v2zm4 0h-2V7h2v2zm4 0h-2V7h2v2zm4 0h-2V7h2v2z'></path>
                          </svg>
                        ),
                      },
                      {
                        value: 'bottom',
                        label: '底部',
                        icon: (
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            data-pointer='none'
                            viewBox='0 0 28 28'
                          >
                            <path d='M23 3H5a4 4 0 0 0-4 4v14a4 4 0 0 0 4 4h18a4 4 0 0 0 4-4V7a4 4 0 0 0-4-4zM9 21H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z'></path>
                          </svg>
                        ),
                      },
                    ].map((item) => (
                      <div
                        key={item.value}
                        className={cn(
                          'fill-[hsla(0,0%,100%,.4)] transition-colors duration-300 text-[hsla(0,0%,100%,.4)] bg-transparent -mt-1 mr-5.5 rounded-[2px] cursor-pointer text-[12px] relative text-center',
                          item.value === position
                            ? 'fill-brand_blue bg-transparent text-brand_blue'
                            : 'hover:fill-brand_blue hover:text-brand_blue'
                        )}
                        onClick={() => setPosition(item.value as DanmakuPosition)}
                      >
                        <div
                          className={
                            'rounded-[2px] size-[26px] z-1 relative text-center text-[26px]'
                          }
                        >
                          {item.icon}
                        </div>
                        <div className={'leading-[14px]'}>{item.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className={'text-xs leading-5.5 my-2.5 mx-5 min-h-5.5 relative w-[176px]'}>
                  <div className={'text-white leading-4 text-left'}>颜色</div>
                  <div
                    className={'flex flex-wrap mt-2 -mr-2 items-center justify-start align-middle'}
                  >
                    <div className={'w-[176px]'}>
                      <div className={'flex h-5.5 mb-1.5 align-middle'}>
                        <div
                          className={
                            'w-auto flex-1 mr-1.5 inline-flex relative items-center justify-start'
                          }
                        >
                          <Input
                            value={inputColor}
                            onChange={(e) => {
                              const val = e.target.value
                              setInputColor(val)

                              if (validateColor(val)) {
                                setSelectColor(val.toUpperCase())
                                setInputColor(selectColor)
                              }
                            }}
                            onBlur={() => {
                              // 失焦时校验颜色格式，不合法就回退到选中颜色
                              if (!validateColor(inputColor)) {
                                setInputColor(selectColor)
                              }
                            }}
                            className={
                              'text-white border border-[hsla(0,0%,100%,.2)] rounded-[2px] text-xs size-full py-1 px-[7px]'
                            }
                          />
                        </div>
                        <div
                          className={
                            'border border-[hsla(0,0%,100%,.2)] rounded-[2px] w-[50px] transition-colors duration-200'
                          }
                          style={{
                            background: selectColor,
                          }}
                        ></div>
                      </div>
                      <ul
                        className='bui-color-picker-options'
                        style={{ marginRight: '-10.666666666666666px' }}
                      >
                        {colors.map((color) => (
                          <li
                            onClick={() => {
                              setSelectColor(color)
                              setInputColor(color)
                            }}
                            key={color}
                            className='border border-black/30 rounded-[2px] cursor-pointer inline-block size-4 mb-1'
                            style={{ background: color, marginRight: '10.666666666666666px' }}
                            data-value={color}
                          ></li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        )}
        {showDanmaku ? (
          <Input
            className={'text-[#212121] grow h-7 leading-7 min-w-25 px-[5px] w-full z-12'}
            placeholder={'发个友善的弹幕见证当下'}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onClick={handleDanmaku}
            onKeyDown={async (e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                e.stopPropagation()
                await handleDanmaku()
              }
            }}
          />
        ) : (
          <div
            className={'px-1.5 grow leading-7 overflow-hidden text-ellipsis whitespace-nowrap z-13'}
          >
            已关闭弹幕
          </div>
        )}
      </div>
      <div
        className={
          'rounded-r-[8px] rounded-b-[8px] h-full  min-w-[62px] w-[62px] leading-[30px] z-13 cursor-pointer inline-flex items-center box-border!'
        }
      >
        <Button
          onClick={handleDanmaku}
          disabled={!showDanmaku}
          className={cn(
            'text-[13px] min-w-15 text-white bg-brand_blue px-[3px] rounded-r-[8px] transition-all duration-200 justify-center items-center',
            !showDanmaku && 'text-[#999] bg-[#e7e7e7]'
          )}
        >
          发送
        </Button>
      </div>
    </div>
  )
}

export default VideoPlayerDanmakuPublish
