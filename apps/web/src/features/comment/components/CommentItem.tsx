'use client'
import { CommentGetItem } from '@mtobdvlb/shared-types'
import { UserHoverAvatar } from '@/components'
import Link from 'next/link'
import UserAvatar from '@/components/ui/UserAvatar'
import WithAt from '@/components/hoc/WithAt'
import { Dispatch, SetStateAction, useState } from 'react'
import { usePageCommentList } from '@/features'
import CommentPublish from '@/features/comment/components/CommentPublish'
import CommentReplyItem from '@/features/comment/components/CommentReplyItem'
import CommentItemFooter from '@/features/comment/components/CommentItemFooter'
import CommentPagination from '@/features/comment/components/CommentPagination'

const CommentItem = ({
  comment,
  user: { name, id, avatar },
  setMainCommentId,
  isReply,
}: {
  comment: CommentGetItem
  user: { id: string; name: string; avatar: string }
  isReply: boolean
  setMainCommentId: Dispatch<SetStateAction<string | null>>
}) => {
  const [commentId, setCommentId] = useState<string | null>(null)
  const [commentName, setCommentName] = useState<string>('')
  const [showReply, setShowReply] = useState(false)
  const [page, setPage] = useState(1)

  const { commentList: commentReplyList, total } = usePageCommentList({
    commentId: comment.id,
    sort: 'hot',
    page,
    enabled: showReply,
  })

  return (
    <div className={'antialiased'}>
      <div className={'relative pl-20 pt-[22px] group'}>
        <UserHoverAvatar user={{ avatar, id, name }}>
          <Link
            target={'_blank'}
            className={'absolute left-5 top-5.5 size-10 origin-[left_top]'}
            href={`/apps/web/src/app/(with-auth)/space/${id}`}
          >
            <UserAvatar avatar={avatar} h={40} w={40} />
          </Link>
        </UserHoverAvatar>
        <div className={'w-full'}>
          <UserHoverAvatar user={{ avatar, id, name }}>
            <Link
              href={`/apps/web/src/app/(with-auth)/space/${id}`}
              target={'_blank'}
              className={'mb-1 cursor-pointer  text-text2 text-[13px] font-medium'}
            >
              {name}
            </Link>
          </UserHoverAvatar>
          <div className={'text-text1 text-[15px] leading-6 '}>
            <WithAt>{comment.content}</WithAt>
          </div>
          <CommentItemFooter
            comment={comment}
            setMainCommentId={setMainCommentId}
            commentId={commentId}
            setCommentId={setCommentId}
            setCommentName={setCommentName}
            isReply={isReply}
            mainCommentId={comment.id}
          />
        </div>
      </div>
      {showReply && (
        <div className={'ml-20 mt-0.5'}>
          {commentReplyList.map((item) => (
            <CommentReplyItem
              mainCommentId={comment.id}
              isReply={isReply}
              setCommentName={setCommentName}
              commentId={commentId}
              setCommentId={setCommentId}
              setMainCommentId={setMainCommentId}
              key={item.id}
              comment={item}
            />
          ))}
          {total > 10 && (
            <CommentPagination
              setShowReply={setShowReply}
              page={page}
              setPage={setPage}
              total={total}
            />
          )}
        </div>
      )}
      {!!comment.comments && !showReply && (
        <div className={'pl-20 mt-0.5'}>
          <div className={'text-[13px] text-text3'}>
            <span>{`共${comment.comments}条回复，`}</span>
            <span
              onClick={() => setShowReply(true)}
              className={'hover:text-brand_blue cursor-pointer '}
            >
              点击查看
            </span>
          </div>
        </div>
      )}
      {isReply && (
        <div className={'pt-[25px] pb-2.5 pl-20 flex'}>
          <div className={'shrink-0 flex items-center justify-center w-[80px] h-[50px]'}>
            <UserAvatar avatar={avatar} h={48} w={48} />
          </div>
          <CommentPublish
            mainCommentId={comment.id}
            name={commentName}
            commentId={commentId ?? undefined}
          />
        </div>
      )}
      <div className={'pb-[14px] ml-20 border-b border-b-graph_bg_thick'}></div>
    </div>
  )
}

export default CommentItem
