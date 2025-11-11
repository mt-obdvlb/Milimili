'use client'

import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import { Button } from '@/components/ui/button'
import { useMemo, useRef, useState } from 'react'
import { cn } from '@/lib'
import Link from 'next/link'
import { VideoList } from '@mtobdvlb/shared-types'

const RecommendedSwiper = ({
  videoSwiperList,
  className,
  pt,
}: {
  videoSwiperList?: VideoList
  className?: string
  pt?: string
}) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [type, setType] = useState<'next' | 'prev'>('next')

  const swiperRef = useRef<SwiperRef | null>(null)

  const handleClick = (index: number) => {
    if (index > activeIndex) {
      setType('next')
    } else if (index < activeIndex) {
      setType('prev')
    }
    swiperRef.current?.swiper.slideToLoop(index)
  }

  const activeVideo = useMemo(
    () => (videoSwiperList ? videoSwiperList[activeIndex] : undefined),
    [activeIndex, videoSwiperList]
  )

  return (
    <div className={cn('relative col-span-2 row-span-2', className)}>
      <div className={'relative w-full'}>
        {!pt && (
          <div className={'grid invisible grid-cols-2 gap-5 opacity-0  pointer-events-none'}>
            <div className={''}>
              <div className={'pt-[56.25%]'}></div>
              <div className={'h-[75px]'}></div>
            </div>
            <div></div>
            <div className={'w-full h-0 pt-[56.26%]'}></div>
            <div className={'w-full h-0 pt-[56.26%]'}></div>
          </div>
        )}
        <div className={'absolute inset-0'}>
          <div className={cn('relative size-full', pt)}>
            <div
              className={
                'bg-graph_bg_regular absolute inset-0 flex flex-col overflow-hidden rounded-[6px]'
              }
            >
              <div
                className={'bg-black/80 absolute inset-0 flex flex-row items-center justify-center'}
              >
                <Swiper
                  ref={swiperRef}
                  modules={[Navigation, Pagination, Autoplay]}
                  spaceBetween={10}
                  slidesPerView={1}
                  loop={true}
                  navigation={{
                    nextEl: '.my-next',
                    prevEl: '.my-prev',
                  }}
                  pagination={{
                    clickable: true,
                    el: '.my-pagination',
                  }}
                  autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                  }}
                  className={'h-full w-full'}
                  onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                  onNavigationNext={() => setType('next')}
                  onNavigationPrev={() => setType('prev')}
                  onAutoplay={() => setType('next')}
                >
                  {videoSwiperList?.map((item, index) => (
                    <SwiperSlide
                      className={'size-full  overflow-hidden outline-none'}
                      key={item.id + index}
                    >
                      <div className={'relative w-full h-0 pt-[56.25%] '}>
                        <div
                          className={
                            'text-text4 bg-graph_bg_regular absolute top-0 left-0 block w-full cursor-none rounded-[6px] size-full whitespace-nowrap'
                          }
                        ></div>
                        <Link
                          target={'_blank'}
                          href={`/video/${item.id}`}
                          className={'bg-graph_bg_regular  absolute inset-0 block size-full'}
                        >
                          <picture
                            className={
                              'bg-graph_bg_regular relative inline-block size-full align-middle'
                            }
                          >
                            <img
                              className={'  object-fit size-full block'}
                              src={item.thumbnail}
                              alt={item.title}
                            />
                          </picture>
                        </Link>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
                <div className={'absolute right-[15px] bottom-[42px] z-3 flex justify-end'}>
                  <Button className='my-prev mr-[12px] flex size-[28px] cursor-pointer items-center justify-center rounded-[8px] bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)]'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 24 24'
                      width='24'
                      height='24'
                      className={'size-[12px] text-white'}
                    >
                      <path
                        d='M15.4571 3.04289C15.8476 3.43342 15.8476 4.06658 15.4571 4.45711L8.09098 11.8232C7.99335 11.9209 7.99335 12.0791 8.09098 12.1768L15.4571 19.5429C15.8476 19.9334 15.8476 20.5666 15.4571 20.9571C15.0666 21.3476 14.4334 21.3476 14.0429 20.9571L6.67677 13.591C5.79809 12.7123 5.79809 11.2877 6.67677 10.409L14.0429 3.04289C14.4334 2.65237 15.0666 2.65237 15.4571 3.04289z'
                        fill='currentColor'
                      ></path>
                    </svg>
                  </Button>
                  <Button className='my-next mr-[12px] flex size-[28px] cursor-pointer items-center justify-center rounded-[8px] bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)]'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 24 24'
                      width='24'
                      height='24'
                      className={'size-[12px] text-white'}
                    >
                      <path
                        d='M8.5429 3.04289C8.15237 3.43342 8.15237 4.06658 8.5429 4.45711L15.909 11.8232C16.0066 11.9209 16.0066 12.0791 15.909 12.1768L8.5429 19.5429C8.15237 19.9334 8.15237 20.5666 8.5429 20.9571C8.93342 21.3476 9.56659 21.3476 9.95711 20.9571L17.3232 13.591C18.2019 12.7123 18.2019 11.2877 17.3232 10.409L9.95711 3.04289C9.56659 2.65237 8.93342 2.65237 8.5429 3.04289z'
                        fill='currentColor'
                      ></path>
                    </svg>
                  </Button>
                </div>
                <div className={'absolute bottom-[20px] left-[15px] z-2 -m-[1.5px]'}>
                  <ul className={'flex transition duration-300'}>
                    {videoSwiperList?.map((item, index) => (
                      <li
                        onClick={() => handleClick(index)}
                        className={cn(
                          'my-pagination relative m-[4px] inline-block size-[8px] cursor-pointer overflow-hidden rounded-full bg-[rgba(255,255,255,0.4)]',
                          index === activeIndex ? 'm-[1px] size-[14px] bg-transparent' : ''
                        )}
                        key={item.id + index}
                      >
                        <div
                          className={cn(
                            "absolute top-0 h-[7px] w-[14px] origin-bottom rounded-t-[7px] will-change-transform after:absolute after:right-0 after:-bottom-[1px] after:left-0 after:h-[1px] after:w-full after:content-['']",
                            index === activeIndex ? 'bg-white after:bg-white' : '',
                            index === activeIndex && type === 'next' ? 'animate-eat-haha-up' : '',
                            index === activeIndex && type === 'prev' ? 'animate-eat-haha-down' : ''
                          )}
                        ></div>
                        <div
                          className={cn(
                            "absolute bottom-0 h-[7px] w-[14px] origin-top rounded-b-[7px] will-change-transform before:absolute before:-top-[1px] before:right-0 before:left-0 before:h-[1px] before:w-full before:content-['']",
                            index === activeIndex ? 'bg-white before:bg-white' : '',
                            index === activeIndex && type === 'next' ? 'animate-eat-haha-down' : '',
                            index === activeIndex && type === 'prev' ? 'animate-eat-haha-up' : ''
                          )}
                        ></div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div
                  className={
                    'w-[calc(100%-100px)] absolute bottom-[42px] left-[15px] z-2 flex items-center'
                  }
                >
                  <Link
                    href={`/video/${activeVideo?.id}`}
                    className={
                      'flex flex-1 items-center justify-start overflow-hidden overflow-ellipsis whitespace-normal'
                    }
                    target={'_blank'}
                  >
                    <span className={'block overflow-hidden text-lg leading-[25px] text-white'}>
                      {activeVideo?.title}
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecommendedSwiper
