import { Dispatch, SetStateAction } from 'react'
import { CommentGetItem } from '@mtobdvlb/shared-types'
import { UserHoverAvatar } from '@/components'
import Link from 'next/link'
import UserAvatar from '@/components/ui/UserAvatar'
import WithAt from '@/components/hoc/WithAt'
import CommentItemFooter from '@/features/comment/components/CommentItemFooter'

const CommentReplyItem = ({
  commentId,
  setCommentId,
  setMainCommentId,
  comment,
  setCommentName,
  isReply,
  mainCommentId,
}: {
  comment: CommentGetItem
  setMainCommentId: Dispatch<SetStateAction<string | null>>
  commentId: string | null
  setCommentId: Dispatch<SetStateAction<string | null>>
  setCommentName: Dispatch<SetStateAction<string>>
  isReply: boolean
  mainCommentId: string
}) => {
  return (
    <div className={'relative py-2 pl-[34px] rounded-[4px] group'}>
      <div className={'w-full overflow-hidden'}>
        <div>
          <span className={'leading-6  text-text1 text-[15px] '}>
            <span className={'inline-block'}>
              <UserHoverAvatar
                user={{ avatar: comment.user.avatar, id: comment.user.id, name: comment.user.name }}
              >
                <Link
                  href={`/apps/web/src/app/(with-auth)/space/${comment.user.id}`}
                  target={'_blank'}
                  className={' mr-1 cursor-pointer inline-block text-text2 text-[13px] font-medium'}
                >
                  {comment.user.name}
                </Link>
              </UserHoverAvatar>
              <UserHoverAvatar
                user={{ avatar: comment.user.avatar, id: comment.user.id, name: comment.user.name }}
              >
                <Link
                  target={'_blank'}
                  className={'absolute left-0  size-6'}
                  href={`/apps/web/src/app/(with-auth)/space/${comment.user.id}`}
                >
                  <UserAvatar avatar={comment.user.avatar} h={24} w={24} />
                </Link>
              </UserHoverAvatar>
            </span>
            <p className={'inline whitespace-pre-line break-words'}>
              <WithAt>{comment.content}</WithAt>
            </p>
          </span>
        </div>
      </div>
      <CommentItemFooter
        comment={comment}
        setCommentId={setCommentId}
        setCommentName={setCommentName}
        isReply={isReply}
        mainCommentId={mainCommentId}
        setMainCommentId={setMainCommentId}
        commentId={commentId}
      />
    </div>
  )
}

export default CommentReplyItem
