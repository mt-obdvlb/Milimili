'use client'

import { MessageListItem, MessageSourceType } from '@mtobdvlb/shared-types'
import { Ref } from 'react'
import MessageCommonAvatar from '@/features/message/components/common/MessageCommonAvatar'
import MessageCommonItemContent from '@/features/message/components/common/MessageCommonItemContent'
import MessageCommonItemTitle from '@/features/message/components/common/MessageCommonItemTitle'
import Link from 'next/link'
import MessageCommonItemMetaData from '@/features/message/components/common/MessageCommonItemMetaData'
import MessageCommonItemCover from '@/features/message/components/common/MessageCommonItemCover'

const MessageLikeListItem = ({
  ref,
  item,
  index,
  total,
}: {
  item: MessageListItem
  index: number
  ref: Ref<HTMLDivElement>
  total: number
}) => {
  console.log(item)
  return (
    <div
      className={'relative cursor-pointer flex group'}
      ref={index === total - 1 ? ref : null}
      key={item.id}
    >
      <MessageCommonAvatar src={item.fromUser.avatar ?? ''} userId={item.fromUser.id ?? ''} />
      <MessageCommonItemContent item={item}>
        <MessageCommonItemTitle>
          <Link
            onClick={(e) => e.stopPropagation()}
            target={'_blank'}
            href={`/apps/web/src/app/(with-auth)/space/${item.fromUser.id}`}
            className={'font-bold decoration-0 hover:text-brand_blue text-text1'}
          >
            {item.fromUser.name}
          </Link>
          <span className={'text-text2 ml-2'}>
            {
              (
                {
                  comment: ' 赞了我的评论',
                  video: ' 赞了我的视频',
                  feed: ' 赞了我的动态',
                } as Record<MessageSourceType, string>
              )[item.sourceType ?? 'video']
            }
          </span>
        </MessageCommonItemTitle>

        <MessageCommonItemMetaData item={item}>
          {/*<MessageCommonItemBtn className={'h-full hover:text-brand_blue'}>*/}
          {/*  <svg*/}
          {/*    xmlns='http://www.w3.org/2000/svg'*/}
          {/*    viewBox='0 0 16 16'*/}
          {/*    width='16'*/}
          {/*    height='16'*/}
          {/*    className={'size-4 '}*/}
          {/*  >*/}
          {/*    <path*/}
          {/*      d='M1.3333333333333333 7C1.3333333333333333 4.05448 3.7211466666666664 1.6666666666666665 6.666666666666666 1.6666666666666665L9.333333333333332 1.6666666666666665C12.278833333333333 1.6666666666666665 14.666666666666666 4.05448 14.666666666666666 7C14.666666666666666 9.843699999999998 12.440933333333334 12.167499999999999 9.636533333333333 12.324333333333332C8.998166666666666 13.1427 7.948533333333334 14.1686 6.474246666666667 14.570333333333332C6.1891333333333325 14.648 5.92802 14.526299999999999 5.782006666666666 14.338366666666666C5.6404266666666665 14.156166666666666 5.59028 13.894933333333334 5.695926666666666 13.651666666666666C5.9177133333333325 13.141033333333333 5.963839999999999 12.672799999999999 5.933633333333333 12.281633333333334C3.3350933333333335 11.9255 1.3333333333333333 9.696666666666665 1.3333333333333333 7zM6.666666666666666 2.6666666666666665C4.273433333333333 2.6666666666666665 2.333333333333333 4.606766666666666 2.333333333333333 7C2.333333333333333 9.306033333333332 4.134893333333333 11.191666666666666 6.407 11.3257C6.633393333333332 11.339066666666668 6.822433333333334 11.5031 6.867533333333332 11.725366666666666C6.9593 12.177299999999999 6.987066666666667 12.741999999999999 6.825866666666666 13.367066666666666C7.792633333333333 12.938366666666667 8.513233333333332 12.171699999999998 8.978566666666666 11.537333333333333C9.071733333333333 11.410333333333334 9.219333333333333 11.334666666666665 9.376833333333334 11.333133333333333C11.749966666666666 11.309833333333332 13.666666666666666 9.378699999999998 13.666666666666666 7C13.666666666666666 4.606766666666666 11.726566666666665 2.6666666666666665 9.333333333333332 2.6666666666666665L6.666666666666666 2.6666666666666665z'*/}
          {/*      fill='currentColor'*/}
          {/*    ></path>*/}
          {/*  </svg>*/}
          {/*  <span>回复</span>*/}
          {/*</MessageCommonItemBtn>*/}
        </MessageCommonItemMetaData>
        <MessageCommonItemCover content={item.myContent ?? ''} />
      </MessageCommonItemContent>
    </div>
  )
}

export default MessageLikeListItem
