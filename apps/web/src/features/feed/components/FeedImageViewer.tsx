'use client'

import Image from 'next/image'
import { useLayoutEffect, useRef, useState } from 'react'
import { cn } from '@/lib'
import { motion } from 'motion/react'
import Lightbox from 'yet-another-react-lightbox'
import { Button } from '@/components'

interface FeedImagesViewerProps {
  images: string[]
}

const FeedImagesViewer = ({ images }: FeedImagesViewerProps) => {
  const [index, setIndex] = useState<number | null>(null)
  const [rotateDeg, setRotateDeg] = useState(0)

  const [isZoom, setIsZoom] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  // 在组件里加状态保存原始宽高
  const containerRef = useRef<HTMLDivElement>(null)
  const [borderStyle, setBorderStyle] = useState({ top: 0, left: 0, width: 58, height: 58 })

  const slides = images.map((src, i) => ({
    src,
    alt: `image-${i}`,
  }))

  // 获取选中缩略图位置
  useLayoutEffect(() => {
    if (index === null || !containerRef.current) return
    const container = containerRef.current
    const item = container.children[index] as HTMLElement
    if (item) {
      const rect = item.getBoundingClientRect()
      const parentRect = container.getBoundingClientRect()
      setBorderStyle({
        top: rect.top - parentRect.top,
        left: rect.left - parentRect.left,
        width: 58,
        height: 58,
      })
    }
  }, [index, images])

  return (
    <>
      {/* 图保持原有样式 */}
      <div className={cn('grid gap-1 grid-cols-3 w-101', isZoom && 'hidden')}>
        {images.slice(0, 9).map((src, i) => (
          <div key={src} className={'size-[132px] bg-white rounded-[6px] overflow-hidden relative'}>
            <div
              className={'bg-[#f1f2f3] relative size-full cursor-zoom-in rounded-[6px]'}
              onClick={() => {
                setIndex(i)
                setRotateDeg(0)
                setIsZoom(true)
              }}
            >
              <Image src={src} alt={`image-${i}`} fill className='object-cover' />
            </div>
            {i === 8 && images.length > 9 && (
              <span
                className={
                  'items-center flex cursor-zoom-in bg-[rgba(0,0,0,.3)] rounded-[4px] text-white text-[16px] h-full justify-center left-0 absolute inset-0 size-full'
                }
                onClick={() => {
                  setIndex(i)
                  setRotateDeg(0)
                  setIsZoom(true)
                }}
              >
                +{images.length - 9}
              </span>
            )}
          </div>
        ))}
      </div>

      <div className={cn(!isZoom && 'hidden')}>
        <div className={'bg-bg2 rounded-t-[4px] rounded-r-[4px] flex h-8'}>
          {[
            {
              label: '收起',
              svg: (
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 14 14' width='14' height='14'>
                  <path
                    d='M7 2.103029166666667C4.296105833333334 2.103029166666667 2.104166666666667 4.294968333333334 2.104166666666667 6.998833333333334C2.104166666666667 9.702750000000002 4.296105833333334 11.894666666666668 7 11.894666666666668C9.703875000000002 11.894666666666668 11.895833333333334 9.702750000000002 11.895833333333334 6.998833333333334C11.895833333333334 4.294968333333334 9.703875000000002 2.103029166666667 7 2.103029166666667zM1.1041666666666667 6.998833333333334C1.1041666666666667 3.7426825000000004 3.74382 1.1030291666666667 7 1.1030291666666667C10.256175 1.1030291666666667 12.895833333333334 3.7426825000000004 12.895833333333334 6.998833333333334C12.895833333333334 10.25505 10.256175 12.894666666666668 7 12.894666666666668C3.74382 12.894666666666668 1.1041666666666667 10.25505 1.1041666666666667 6.998833333333334z'
                    fill='currentColor'
                  ></path>
                  <path
                    d='M4.083333333333334 7C4.083333333333334 6.723858333333334 4.307193333333334 6.5 4.583333333333333 6.5L9.416666666666668 6.5C9.692808333333334 6.5 9.916666666666668 6.723858333333334 9.916666666666668 7C9.916666666666668 7.276141666666667 9.692808333333334 7.500000000000001 9.416666666666668 7.500000000000001L4.583333333333333 7.500000000000001C4.307193333333334 7.500000000000001 4.083333333333334 7.276141666666667 4.083333333333334 7z'
                    fill='currentColor'
                  ></path>
                </svg>
              ),
              onClick: () => {
                setIsZoom(false)
              },
            },
            {
              label: '查看大图',
              svg: (
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 14 14' width='14' height='14'>
                  <path
                    d='M6.270833333333334 2.3958333333333335C4.130730833333334 2.3958333333333335 2.3958333333333335 4.130730833333334 2.3958333333333335 6.270833333333334C2.3958333333333335 8.410958333333333 4.130730833333334 10.145833333333334 6.270833333333334 10.145833333333334C8.410958333333333 10.145833333333334 10.145833333333334 8.410958333333333 10.145833333333334 6.270833333333334C10.145833333333334 4.130730833333334 8.410958333333333 2.3958333333333335 6.270833333333334 2.3958333333333335zM1.3958333333333335 6.270833333333334C1.3958333333333335 3.578445 3.578445 1.3958333333333335 6.270833333333334 1.3958333333333335C8.963216666666668 1.3958333333333335 11.145833333333334 3.578445 11.145833333333334 6.270833333333334C11.145833333333334 8.963216666666668 8.963216666666668 11.145833333333334 6.270833333333334 11.145833333333334C3.578445 11.145833333333334 1.3958333333333335 8.963216666666668 1.3958333333333335 6.270833333333334z'
                    fill='currentColor'
                  ></path>
                  <path
                    d='M9.271441666666668 9.271441666666668C9.466700000000001 9.0762 9.7833 9.0762 9.978558333333332 9.271441666666668L11.874391666666666 11.167275000000002C12.069633333333334 11.362533333333335 12.069633333333334 11.679133333333333 11.874391666666666 11.874391666666666C11.679133333333333 12.069633333333334 11.362533333333335 12.069633333333334 11.167275000000002 11.874391666666666L9.271441666666668 9.978558333333332C9.0762 9.7833 9.0762 9.466700000000001 9.271441666666668 9.271441666666668z'
                    fill='currentColor'
                  ></path>
                </svg>
              ),
              onClick: () => {
                setIsOpen(true)
              },
            },
            {
              label: '向左旋转',
              svg: (
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 14 14' width='14' height='14'>
                  <path
                    d='M7 2.5416666666666665C4.537728333333334 2.5416666666666665 2.5416666666666665 4.537728333333334 2.5416666666666665 7C2.5416666666666665 9.462258333333335 4.537728333333334 11.458333333333334 7 11.458333333333334C8.228508333333334 11.458333333333334 9.340141666666668 10.962100000000001 10.147058333333336 10.157975000000002C10.342658333333333 9.963033333333334 10.659241666666667 9.963591666666666 10.854158333333334 10.159191666666667C11.0491 10.354775 11.048541666666669 10.671375000000001 10.852941666666666 10.866291666666669C9.866241666666667 11.8496 8.50375 12.458333333333334 7 12.458333333333334C3.985445833333334 12.458333333333334 1.5416666666666667 10.014558333333333 1.5416666666666667 7C1.5416666666666667 3.985445833333334 3.985445833333334 1.5416666666666667 7 1.5416666666666667C10.014558333333333 1.5416666666666667 12.458333333333334 3.985445833333334 12.458333333333334 7C12.458333333333334 7.2046 12.447066666666666 7.406766666666668 12.425058333333334 7.605858333333334C12.394716666666667 7.880358333333334 12.147616666666668 8.078258333333334 11.873116666666668 8.0479C11.598658333333335 8.017558333333334 11.400758333333336 7.770458333333334 11.431116666666668 7.496C11.449066666666667 7.333308333333334 11.458333333333334 7.167841666666667 11.458333333333334 7C11.458333333333334 4.537728333333334 9.462258333333335 2.5416666666666665 7 2.5416666666666665z'
                    fill='currentColor'
                  ></path>
                  <path
                    d='M10.146441666666668 6.354775000000001C10.341700000000001 6.159533333333334 10.6583 6.159533333333334 10.853558333333332 6.354775000000001L11.958333333333334 7.459566666666667L13.063108333333336 6.354775000000001C13.258366666666667 6.159533333333334 13.574966666666667 6.159533333333334 13.770225 6.354775000000001C13.965466666666668 6.550033333333333 13.965466666666668 6.8666333333333345 13.770225 7.061891666666667L12.415008333333335 8.417091666666668C12.162775 8.669325 11.753891666666668 8.669325 11.501658333333333 8.417091666666668L10.146441666666668 7.061891666666667C9.951200000000002 6.8666333333333345 9.951200000000002 6.550033333333333 10.146441666666668 6.354775000000001z'
                    fill='currentColor'
                  ></path>
                </svg>
              ),
              onClick: () => {
                setRotateDeg((prev) => prev - 90)
              },
            },
            {
              label: '向右旋转',
              svg: (
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 14 14' width='14' height='14'>
                  <path
                    d='M7 2.5416666666666665C4.537728333333334 2.5416666666666665 2.5416666666666665 4.537728333333334 2.5416666666666665 7C2.5416666666666665 9.462258333333335 4.537728333333334 11.458333333333334 7 11.458333333333334C8.228508333333334 11.458333333333334 9.340141666666668 10.962100000000001 10.147058333333336 10.157975000000002C10.342658333333333 9.963033333333334 10.659241666666667 9.963591666666666 10.854158333333334 10.159191666666667C11.0491 10.354775 11.048541666666669 10.671375000000001 10.852941666666666 10.866291666666669C9.866241666666667 11.8496 8.50375 12.458333333333334 7 12.458333333333334C3.985445833333334 12.458333333333334 1.5416666666666667 10.014558333333333 1.5416666666666667 7C1.5416666666666667 3.985445833333334 3.985445833333334 1.5416666666666667 7 1.5416666666666667C10.014558333333333 1.5416666666666667 12.458333333333334 3.985445833333334 12.458333333333334 7C12.458333333333334 7.2046 12.447066666666666 7.406766666666668 12.425058333333334 7.605858333333334C12.394716666666667 7.880358333333334 12.147616666666668 8.078258333333334 11.873116666666668 8.0479C11.598658333333335 8.017558333333334 11.400758333333336 7.770458333333334 11.431116666666668 7.496C11.449066666666667 7.333308333333334 11.458333333333334 7.167841666666667 11.458333333333334 7C11.458333333333334 4.537728333333334 9.462258333333335 2.5416666666666665 7 2.5416666666666665z'
                    fill='currentColor'
                  ></path>
                  <path
                    d='M10.146441666666668 6.354775000000001C10.341700000000001 6.159533333333334 10.6583 6.159533333333334 10.853558333333332 6.354775000000001L11.958333333333334 7.459566666666667L13.063108333333336 6.354775000000001C13.258366666666667 6.159533333333334 13.574966666666667 6.159533333333334 13.770225 6.354775000000001C13.965466666666668 6.550033333333333 13.965466666666668 6.8666333333333345 13.770225 7.061891666666667L12.415008333333335 8.417091666666668C12.162775 8.669325 11.753891666666668 8.669325 11.501658333333333 8.417091666666668L10.146441666666668 7.061891666666667C9.951200000000002 6.8666333333333345 9.951200000000002 6.550033333333333 10.146441666666668 6.354775000000001z'
                    fill='currentColor'
                  ></path>
                </svg>
              ),
              onClick: () => {
                setRotateDeg((deg) => deg + 90)
              },
            },
          ].map((item) => (
            <div
              className={
                'items-center text-text2 cursor-pointer flex text-xs h-full px-4 select-none'
              }
              key={item.label}
              onClick={item.onClick}
            >
              {item.svg}
              <span>{item.label}</span>
            </div>
          ))}
        </div>
        {/*大图*/}
        <div className={'bg-bg2 flex flex-col relative text-center w-full'}>
          {typeof index === 'number' && images[index] && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              style={{
                transform: `rotate(${rotateDeg}deg)`,
              }}
              src={images[index]}
              alt={images[index]}
              className={
                'rounded-b-[4px] block rounded-l-[4px] cursor-zoom-out  max-w-full select-none'
              }
              onClick={() => {
                setIsZoom(false)
                setRotateDeg(0)
                setIndex(null)
              }}
            />
          )}
          <div
            className={
              "cursor-[url('/images/prev-pointer.png'),_pointer] left-0 h-full top-0 w-1/3 absolute"
            }
            onClick={() => {
              setRotateDeg(0)
              if (index === null) {
                return
              }
              if (index === 0) {
                setIndex(images.length - 1)
              } else {
                setIndex(index - 1)
              }
            }}
          />
          <div
            className={
              "cursor-[url('/images/next-pointer.png'),_pointer] right-0 h-full top-0 w-1/3 absolute"
            }
            onClick={() => {
              setRotateDeg(0)
              if (index === null) {
                return
              }
              if (index === images.length - 1) {
                setIndex(0)
              } else {
                setIndex(index + 1)
              }
            }}
          />
        </div>
        {/* 缩略图 */}
        <div className={'mt-1.5 relative select-none'}>
          {index !== null && isZoom && borderStyle && (
            <motion.div
              layoutId='selected-border'
              className={cn(
                'border border-[#fb7299] rounded-[4px] absolute -translate-0.5 pointer-events-none'
              )}
              animate={borderStyle}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
          <div className={'w-full overflow-hidden'}>
            <div
              ref={containerRef}
              className={'w-full flex  duration-180 transition-[cubic-bezier(.22,_.58,_.12,_.98)]'}
            >
              {images.map((image, i) => (
                <div
                  key={image}
                  className={'cursor-pointer  not-first-of-type:ml-1 shrink-0 size-[54px] relative'}
                  onClick={() => {
                    setRotateDeg(0)
                    setIndex(i)
                  }}
                >
                  <Image
                    fill
                    src={image}
                    alt={image}
                    className={cn(
                      'size-full opacity-50 hover:opacity-100 rounded-[6px] transition-[opacity,_cubic-bezier(.22,_.58,_.12,_.98)] duration-180',
                      index === i && 'opacity-100'
                    )}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Lightbox
        render={{
          buttonPrev: () => (
            <Button
              className={cn(
                'ml-4 opacity-100 hover:text-brand_pink transition-[opacity_333ms_cubic-bezier(0.4,_0,_0.22,1)]zZzzz z-10 flex items-center justify-center size-[42px] rounded-full bg-[rgba(0,0,0,.58)] cursor-pointer outline-none border-none text-white absolute left-0 top-1/2 -mt-[50px]'
              )}
              onClick={() =>
                setIndex((index) => {
                  if (index === null) {
                    return null
                  }
                  if (index === 0) {
                    return images.length - 1
                  }
                  return index - 1
                })
              }
            >
              <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'>
                <path
                  d='M12.733583333333334 2.6830583333333333C12.977666666666668 2.927141666666667 12.977666666666668 3.3228666666666666 12.733583333333334 3.566941666666667L6.595175 9.705375C6.432458333333334 9.868125 6.432458333333334 10.131875 6.595175 10.294625L12.733583333333334 16.433041666666668C12.977666666666668 16.677125 12.977666666666668 17.072875 12.733583333333334 17.316958333333332C12.489541666666668 17.561 12.093791666666666 17.561 11.849708333333334 17.316958333333332L5.711291666666667 11.1785C5.060416666666667 10.527625 5.060416666666667 9.472375 5.711291666666667 8.8215L11.849708333333334 2.6830583333333333C12.093791666666666 2.4389833333333333 12.489541666666668 2.4389833333333333 12.733583333333334 2.6830583333333333z'
                  fill='currentColor'
                ></path>
              </svg>
            </Button>
          ),
          buttonNext: () => (
            <>
              <Button
                className={cn(
                  'mr-4 rotate-180 hover:text-brand_pink opacity-100 transition-[opacity_333ms_cubic-bezier(0.4,_0,_0.22,1)] z-10 flex items-center justify-center size-[42px] rounded-full bg-[rgba(0,0,0,.58)] cursor-pointer outline-none border-none text-white absolute right-0 top-1/2 -mt-[50px]'
                )}
                onClick={() => {
                  setIndex((index) => {
                    if (index === null) {
                      return null
                    }
                    if (index === images.length - 1) {
                      return 0
                    }
                    return index + 1
                  })
                }}
              >
                <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'>
                  <path
                    d='M12.733583333333334 2.6830583333333333C12.977666666666668 2.927141666666667 12.977666666666668 3.3228666666666666 12.733583333333334 3.566941666666667L6.595175 9.705375C6.432458333333334 9.868125 6.432458333333334 10.131875 6.595175 10.294625L12.733583333333334 16.433041666666668C12.977666666666668 16.677125 12.977666666666668 17.072875 12.733583333333334 17.316958333333332C12.489541666666668 17.561 12.093791666666666 17.561 11.849708333333334 17.316958333333332L5.711291666666667 11.1785C5.060416666666667 10.527625 5.060416666666667 9.472375 5.711291666666667 8.8215L11.849708333333334 2.6830583333333333C12.093791666666666 2.4389833333333333 12.489541666666668 2.4389833333333333 12.733583333333334 2.6830583333333333z'
                    fill='currentColor'
                  ></path>
                </svg>
              </Button>
              <div
                className={cn(
                  'h-[30px] mt-5 absolute top-0 left-0 ml-4 text-sm leading-[30px] text-white text-shadow-[1px_1px_3px_#4f4f4f] opacity-85'
                )}
              >{`${(index ?? 0) + 1}  /  ${images.length}`}</div>
              <div
                className={cn(
                  'absolute opacity-100 bg-transparent flex  items-center left-1/2 bottom-3 rounded-[8px] cursor-pointer transition-all duration-150 ease-out px-1.5 -translate-x-1/2 backdrop-blur-[1px]  hover:backdrop-blur-[10px]'
                )}
              >
                {images.map((img, i) => (
                  <div
                    onClick={() => {
                      setIndex(i)
                    }}
                    key={img}
                    className={'h-6 flex items-center justify-center relative'}
                  >
                    <span
                      className={cn(
                        'block mx-[3px] size-1.5 rounded-[6px] bg-bg1 opacity-50 transition-bg duration-300 filter-[drop-shadow(0_1px_4px_rgba(0,0,0,0.25)] ',
                        i === index && 'opacity-100'
                      )}
                    ></span>
                  </div>
                ))}
              </div>
            </>
          ),
          buttonClose: () => (
            <Button
              className={cn(
                'mr-4 mt-4   hover:text-brand_pink opacity-100 transition-[opacity_333ms_cubic-bezier(0.4,_0,_0.22,1)]' +
                  ' z-10 flex items-center justify-center size-[42px] rounded-full bg-[rgba(0,0,0,.58)] cursor-pointer outline-none border-none ' +
                  'text-white absolute right-0 top-0 '
              )}
              onClick={() => {
                setIsOpen(false)
              }}
            >
              <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'>
                <path
                  d='M4.106275 4.108583333333334C4.350341666666667 3.8645000000000005 4.746083333333333 3.8645000000000005 4.9901583333333335 4.108583333333334L9.998666666666667 9.117125L15.008583333333334 4.107216666666667C15.252625 3.8631333333333338 15.648375000000001 3.8631333333333338 15.892458333333334 4.107216666666667C16.136541666666666 4.351291666666667 16.136541666666666 4.747025000000001 15.892458333333334 4.9911L10.882541666666667 10.001000000000001L15.891375 15.009791666666667C16.135458333333332 15.253874999999999 16.135458333333332 15.649625 15.891375 15.893708333333334C15.647291666666668 16.13775 15.251541666666668 16.13775 15.0075 15.893708333333334L9.998666666666667 10.884875000000001L4.991233333333334 15.892333333333333C4.747158333333333 16.13641666666667 4.351425 16.13641666666667 4.10735 15.892333333333333C3.8632750000000002 15.648249999999999 3.8632750000000002 15.252541666666666 4.10735 15.008458333333333L9.114791666666667 10.001000000000001L4.106275 4.992466666666667C3.8621916666666665 4.7483916666666675 3.8621916666666665 4.352658333333333 4.106275 4.108583333333334z'
                  fill='currentColor'
                ></path>
              </svg>
            </Button>
          ),
        }}
        styles={{
          container: {
            backgroundColor: 'rgba(0,0,0,0.8)',
          },
        }}
        open={isOpen}
        close={() => setIsOpen(false)}
        slides={slides}
        index={index ?? 0}
      />
    </>
  )
}

export default FeedImagesViewer
