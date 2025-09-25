'use client'

import { MessageType } from '@mtobdvlb/shared-types'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { cn } from '@/lib'

const MessageLayoutListItem = ({
  type,
  statistic,
  label,
}: {
  label: string
  statistic: number
  type: MessageType
}) => {
  const pathname = usePathname()
  const router = useRouter()
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    if (pathname.includes(type)) {
      setIsActive(true)
    } else {
      setIsActive(false)
    }
  }, [pathname, setIsActive, type])

  return (
    <li
      onClick={() => {
        router.push(`/message/${type}`)
      }}
      className={cn(
        'h-10 hover:text-brand_blue list-none pl-5 text-text2 text-sm relative cursor-pointer flex items-center',
        isActive && 'text-brand_blue'
      )}
    >
      <div
        className={
          'size-1.5 rounded-full bg-text2 flex items-center justify-center absolute left-0.5 top-1/2 -translate-y-1/2'
        }
      ></div>
      <div className={'select-none min-w-[56px]'}>{label}</div>
      <div className={'ml-1'}>
        {!!statistic && (
          <div
            className={'bg-brand_pink leading-4 text-xs rounded-[10px] w-7 text-white text-center'}
          >
            {statistic}
          </div>
        )}
      </div>
    </li>
  )
}

export default MessageLayoutListItem
