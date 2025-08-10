'use client'

import { useState } from 'react'
import { clsx } from 'clsx'
import Image from 'next/image'

const HeaderBanner = () => {
  const [isMouseEnter, setIsMouseEnter] = useState<boolean>()

  return (
    <section
      onMouseEnter={() => setIsMouseEnter(true)}
      onMouseLeave={() => setIsMouseEnter(false)}
      className={
        'absolute top-0 left-0 z-0 flex h-[9.375vw] min-h-[155px] w-full min-w-[1000px] justify-center bg-[#e3e5e7]'
      }
    >
      <picture className='absolute inset-0'>
        <img src='/images/header-banner.png' alt='' className='h-full w-full object-cover' />
      </picture>
      <div className={'relative inset-0 z-1 flex size-full items-end px-[64px]'}>
        <a
          href='//www.bilibili.com'
          className='mb-[10px] inline-block h-1/2 min-h-[60px] w-[180px]'
        >
          <Image
            className='block object-contain'
            alt='M站 m站'
            width='162'
            height='78'
            src='/images/logo.png'
          />
        </a>
        <a
          href='//www.bilibili.com/blackboard/era/7DBE7xJEPRIuH99N.html?native.theme=1&amp;night=0&amp;share_source=&amp;share_medium=iphone&amp;bbid=1CA6DBE4-1CE6-839A-03FE-FE4FB13F598218231infoc&amp;ts=1752572300662'
          target='_blank'
          className={
            'absolute bottom-[25px] left-[380px] max-w-[350px] rounded bg-[rgba(47,50,56,0.9)] px-2.5 py-1.5 text-sm leading-5 text-white transition-opacity duration-300 ' +
            clsx({
              'opacity-100': isMouseEnter,
              'opacity-0': !isMouseEnter,
            })
          }
        >
          前往投票
        </a>
      </div>
      <div
        className={
          'absolute top-0 left-0 h-[100px] w-full bg-gradient-to-b from-[rgba(0,0,0,0.4)] to-transparent'
        }
      ></div>
      <a
        target={'_blank'}
        href={
          'https://www.bilibili.com/blackboard/era/7DBE7xJEPRIuH99N.html?native.theme=1&night=0&share_source=&share_medium=iphone&bbid=1CA6DBE4-1CE6-839A-03FE-FE4FB13F598218231infoc&ts=1752572300662&spm_id_from=333.1007.0.0'
        }
        className={'absolute inset-0 z-1 cursor-pointer'}
      ></a>
    </section>
  )
}

export default HeaderBanner
