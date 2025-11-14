'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const NotFoundErrorPanel = () => {
  const router = useRouter()
  return (
    <div className={'overflow-hidden'}>
      <Image src={'/images/very_sorry.png'} width={980} height={211} alt={'very_sorry'} />
      <div className={'pb-10 text-center'}>
        <Link
          className={
            'float-none inline-block cursor-pointer rounded-[4px] bg-[#00a1d6] px-5 text-center align-middle text-[16px] leading-10 text-white transition duration-200'
          }
          href={''}
          onClick={(e) => {
            e.preventDefault()
            if (window.history.length > 1) {
              router.back()
            } else {
              router.push('/')
            }
          }}
        >
          返回上一页
        </Link>
      </div>
    </div>
  )
}

export default NotFoundErrorPanel
