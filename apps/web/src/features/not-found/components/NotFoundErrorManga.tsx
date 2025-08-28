'use client'

import Image from 'next/image'
import { getRandomIndex } from '@/utils/getRandomIndex'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const number = 10

const NotFoundErrorManga = () => {
  const [index, setIndex] = useState<number | null>(null)

  useEffect(() => {
    setIndex(getRandomIndex(number) + 1)
  }, [])

  const getRandom = () => {
    setIndex(getRandomIndex(number) + 1)
  }

  useEffect(() => {
    const originalBackgroundColor = document.body.style.backgroundColor
    document.body.style.backgroundColor = '#f0f0f0'
    return () => {
      document.body.style.backgroundColor = originalBackgroundColor
    }
  }, [])

  if (index === null) return null // 等待客户端渲染

  return (
    <div className={'p-[30px] text-center'}>
      <Image
        src={`/images/mangas/manga_${index}.png`}
        alt={`manga`}
        className={'size-auto max-w-200 bg-white'}
        unoptimized
        width={1}
        height={1}
        key={index}
        style={{
          width: 'auto',
          height: 'auto',
          maxWidth: '800px',
        }}
      />
      <Link
        href={'#up'}
        className={
          'bg-brand_blue mx-auto mt-[30px] block h-12 w-[150px] rounded-[4px] text-center align-middle text-[16px] leading-12 text-white transition duration-200'
        }
        onClick={(e) => {
          e.preventDefault()
          getRandom()
        }}
      >
        换一张
      </Link>
    </div>
  )
}

export default NotFoundErrorManga
