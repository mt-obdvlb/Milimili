'use client'

import type { FC } from 'react'
import { useState } from 'react'
import { LayoutGroup, motion } from 'motion/react'
import { Tabs, TabsList, TabsTrigger } from '@/components'

const historyTypeList = [
  { label: '综合', value: 'all' },
  { label: '视频', value: 'video' },
] as const

const HistoryTabs: FC = () => {
  const [type, setType] = useState<'all' | 'video'>('all')

  return (
    <Tabs value={type} onValueChange={(v) => setType(v as 'all' | 'video')}>
      <TabsList className='relative flex gap-x-7'>
        {/* LayoutGroup 协调 shared layout 动画 */}
        <LayoutGroup>
          {historyTypeList.map((item) => (
            <TabsTrigger
              key={item.value}
              value={item.value}
              className='text-text2 hover:text-brand_blue data-[state=active]:text-brand_blue relative flex min-w-[52px] shrink-0 cursor-pointer items-center justify-center px-2.5 py-3 text-sm leading-[22px] transition-all duration-300 data-[state=active]:font-medium'
            >
              {/* 文字 wrapper，inline-block 宽度正好包住文字 */}
              <motion.span layout className='inline-block'>
                {/* 文字本体（在 motion.div / motion.span 里） */}
                <motion.span>{item.label}</motion.span>

                {/* 仅在激活项渲染下划线（shared layout：相同 layoutId） */}
                {type === item.value && (
                  <motion.span
                    layoutId='history-underline'
                    className='bg-brand_blue absolute right-3 bottom-0 left-3 h-[4px] rounded-[2px]'
                    transition={{
                      duration: 0.2,
                    }}
                  />
                )}
              </motion.span>
            </TabsTrigger>
          ))}
        </LayoutGroup>
      </TabsList>
    </Tabs>
  )
}

export default HistoryTabs
