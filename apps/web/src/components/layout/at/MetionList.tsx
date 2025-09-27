'use client'

import React, { useEffect, useImperativeHandle, useState } from 'react'
import { tv } from 'tailwind-variants'
import { cn } from '@/lib'
import { MentionListProps } from '@/components/layout/at/MentionListRef'
import Image from 'next/image'
import { formatPlayCount } from '@/utils'

export default function MentionList(props: MentionListProps) {
  const { items, command, ref } = props
  const [selectedIndex, setSelectedIndex] = useState(0)

  const selectItem = (index: number) => {
    const item = items[index]
    if (item) {
      command({
        id: item.id, // 必填
        label: item.name, // 额外传 name
      })
    }
  }

  const upHandler = () => {
    setSelectedIndex((prev) => (prev + items.length - 1) % items.length)
  }

  const downHandler = () => {
    setSelectedIndex((prev) => (prev + 1) % items.length)
  }

  const hoverHandler = (index: number) => {
    setSelectedIndex(index)
  }

  const enterHandler = () => {
    selectItem(selectedIndex)
  }

  useEffect(() => setSelectedIndex(0), [items])

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }) => {
      if (event.key === 'ArrowUp') {
        upHandler()
        return true
      }

      if (event.key === 'ArrowDown') {
        downHandler()
        return true
      }

      if (event.key === 'Enter') {
        enterHandler()
        return true
      }

      return false
    },
  }))

  const groupStyles = tv({
    slots: {
      base: 'group',
      groupName: 'group-last-of-type:mb-0.5 text-[13px] leading-4.5 text-text2 pl-3',
      groupList: '',
    },
  })

  const { base, groupList } = groupStyles()

  return (
    <div className='bg-bg1_float border border-line_regular rounded-[6px] shadow-[0_3px_5px_0_rgba(0,0,0,.17)] text-xs w-[219px]'>
      <div className='text-text2 cursor-default tracking-normal leading-[17px] m-0 p-3'>
        选择或输入你想@的人
      </div>
      <div className='max-h-[282px] overflow-y-auto w-full'>
        <div className={cn(base())}>
          <div className={cn(groupList())}>
            {items.map((item, index) => (
              <div
                onMouseEnter={() => hoverHandler(index)}
                key={item.id}
                onClick={() => selectItem(index)}
                className={cn(
                  'items-center cursor-pointer flex flex-row h-[52px] pl-3',
                  index === selectedIndex && 'bg-bg2 not-last-of-type:mb-0.5'
                )}
              >
                <div className={'shrink-0 size-9 relative'}>
                  <Image
                    src={item.avatar}
                    alt={item.name}
                    fill
                    className={'size-9 rounded-[20px]'}
                  />
                </div>
                <div className={'grow pl-2'}>
                  <div className={'text-[13px] leading-4.5 text-text1 tracking-normal'}>
                    {item.name}
                  </div>
                  <div className={'text-[13px] leading-4.5 text-text3 tracking-normal mt-[3px]'}>
                    {formatPlayCount(item.followings) + '粉丝'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
