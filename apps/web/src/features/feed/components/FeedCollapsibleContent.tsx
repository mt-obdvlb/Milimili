'use client'

import { useEffect, useRef, useState } from 'react'
import WithAt from '@/components/hoc/WithAt'
import { openNewTab } from '@/utils'
import { cn } from '@/lib'

interface ContentProps {
  content: string
  feedId: string
  isExpand?: boolean
  isLink?: boolean
}

const FeedCollapsibleContent = ({ content, feedId, isExpand, isLink = true }: ContentProps) => {
  const contentRef = useRef<HTMLDivElement>(null)
  const [showExpand, setShowExpand] = useState(false)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    if (contentRef.current) {
      const el = contentRef.current
      // 判断是否溢出
      if (el.scrollHeight > el.clientHeight) {
        setShowExpand(true)
      }
    }
  }, [content])

  return (
    <div className='text-[15px] antialiased font-normal whitespace-pre-wrap break-words'>
      <div
        onClick={() => {
          if (isLink) openNewTab(`/feed/${feedId}`)
        }}
        ref={contentRef}
        className={cn(
          `leading-[25px]   text-ellipsis text-text1 ${
            !expanded && !isExpand ? 'line-clamp-6 max-h-[171px]' : ''
          }`,
          isLink && 'cursor-pointer'
        )}
      >
        <WithAt>{content}</WithAt>
      </div>

      {showExpand && !isExpand && (
        <div
          className='text-text_link cursor-pointer inline-block select-none text-[15px]'
          onClick={() => setExpanded((prev) => !prev)}
        >
          {expanded ? '收起' : '展开'}
        </div>
      )}
    </div>
  )
}

export default FeedCollapsibleContent
