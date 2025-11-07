'use client'

import { Tabs, TabsList, TabsTrigger } from '@/components'
import { Dispatch, SetStateAction } from 'react'
import { cn } from '@/lib'
import { usePathname, useRouter } from 'next/navigation'

export interface CommonTabItem<T extends string = string> {
  name: string
  value: T
  url?: string
  desc?: string
}

interface SpaceCommonTabsProps<T extends string> {
  /** 当前选中的 tab 值 */
  type: T
  /** 设置选中项 */
  setType: Dispatch<SetStateAction<T>>
  /** tab 列表 */
  tabs: CommonTabItem<T>[]
  /** 自定义类名 */
  className?: string
  /** 容器样式（默认竖向） */
  orientation?: 'vertical' | 'horizontal'

  link?: boolean
}

const SpaceCommonTabs = <T extends string>({
  type,
  setType,
  tabs,
  className,
  orientation = 'vertical',
  link,
}: SpaceCommonTabsProps<T>) => {
  const isVertical = orientation === 'vertical'
  const router = useRouter()
  const pathname = usePathname()

  const handleChange = (value: string) => {
    const segments = pathname.split('/')
    // 替换最后一段
    segments[segments.length - 1] = value
    const newPath = segments.join('/')
    router.push(newPath)
  }

  return (
    <Tabs
      value={type}
      onValueChange={(value) => (link ? handleChange(value) : setType(value as T))}
      className={cn(
        'shrink-0',
        isVertical ? 'w-[150px] h-[300px] sticky top-20 block' : 'w-full',
        className
      )}
    >
      <TabsList
        className={cn(
          isVertical
            ? 'flex flex-col w-full items-stretch'
            : 'flex flex-row w-full items-center justify-start'
        )}
      >
        {tabs.map((item) => (
          <TabsTrigger
            key={item.value}
            value={item.value}
            className={cn(
              'cursor-pointer flex items-center justify-between h-[52px] py-[14px] px-4 rounded-[6px] transition-colors duration-300',
              isVertical ? 'w-full mt-2' : 'mx-2',
              type === item.value ? 'bg-brand_blue text-white' : 'hover:bg-graph_bg_thin'
            )}
          >
            <span className={'text-sm'}>{item.name}</span>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}

export default SpaceCommonTabs
