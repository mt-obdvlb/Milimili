'use client'
import { CommentGetDTO, CommentSort } from '@mtobdvlb/shared-types'
import { useInfiniteCommentList } from '@/features'
import { useState } from 'react'
import { Separator, Tabs, TabsList, TabsTrigger } from '@/components'
import UserAvatar from '@/components/ui/UserAvatar'
import CommentPublish from '@/features/comment/components/CommentPublish'
import { useInfiniteScroll } from '@/hooks'
import { openNewTab } from '@/utils'
import CommentItem from '@/features/comment/components/CommentItem'

const CommentWrapper = ({
  isLink,
  user: { name, id, avatar },
  ...props
}: Pick<CommentGetDTO, 'videoId' | 'feedId'> & {
  isLink?: boolean
  user: {
    id: string
    name: string
    avatar: string
  }
}) => {
  const [sort, setSort] = useState<CommentSort>('hot')
  const { commentList, fetchNextPage, hasNextPage, total } = useInfiniteCommentList({
    ...props,
    sort,
  })

  const { ref: fetchRef } = useInfiniteScroll(fetchNextPage)

  const [commentId, setCommentId] = useState<string | null>(null)

  return (
    <div>
      <div>
        <div className={'mb-2.5'}></div>
        <Tabs
          value={sort}
          onValueChange={(v) => setSort(v as CommentSort)}
          className={'flex items-center h-7 mb-5.5 flex-row'}
        >
          <div className={'flex items-center'}>
            <h2 className={'m-0 text-text1 font-medium text-[20px]'}>评论</h2>
            <div className={'mr-[30px] ml-1.5 text-[13px] font-normal text-text3'}>{total}</div>
          </div>
          <TabsList className={'inline-flex h-full items-center'}>
            <TabsTrigger
              className={
                'px-1.5 text-[13px]  data-[state=active]:text-[#18191c] data-[state=active]:hover:text-brand_blue hover:text-brand_blue text-text3 inline-flex items-center justify-center select-none h-full cursor-pointer'
              }
              value={'hot'}
            >
              最热
            </TabsTrigger>
            <Separator className={'h-[11px] mx-[3px]'} orientation={'vertical'} />
            <TabsTrigger
              className={
                'px-1.5 text-[13px] data-[state=active]:text-[#18191c] hover:text-brand_blue text-text3 inline-flex items-center justify-center select-none h-full cursor-pointer'
              }
              value={'new'}
            >
              最新
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div className={'flex'}>
          <div className={'shrink-0 flex items-center justify-center w-[80px] h-[50px]'}>
            <UserAvatar avatar={avatar} h={48} w={48} />
          </div>
          <CommentPublish {...props} />
        </div>
      </div>
      <div className={'pt-[14px] relative'}>
        <div>
          {commentList.map((comment) => (
            <CommentItem
              isReply={commentId === comment.id}
              setMainCommentId={setCommentId}
              comment={comment}
              user={{ avatar, id, name }}
              key={comment.id}
            />
          ))}
        </div>
      </div>
      <div ref={isLink ? null : fetchRef}>
        {!(isLink && props.feedId && hasNextPage) && (
          <div className={'my-5 w-ful text-[13px] text-text3 text-center select-none'}>
            没有更多评论
          </div>
        )}
        {isLink && hasNextPage && props.feedId && (
          <div
            className={
              'my-5 w-ful hover:text-brand_blue text-[13px] text-text3 text-center select-none cursor-pointer'
            }
            onClick={() => openNewTab(`/feed/${props.feedId}`)}
          >
            查看更多评论
          </div>
        )}
      </div>
    </div>
  )
}

export default CommentWrapper
