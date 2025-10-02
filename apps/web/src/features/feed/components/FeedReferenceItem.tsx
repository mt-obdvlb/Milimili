import { useFeedGetById } from '@/features'
import FeedCollapsibleContent from '@/features/feed/components/FeedCollapsibleContent'
import FeedImagesViewer from '@/features/feed/components/FeedImageViewer'
import FeedVideoContent from '@/features/feed/components/FeedVideoContent'
import Link from 'next/link'
import { UserHoverAvatar } from '@/components'
import UserAvatar from '@/components/ui/UserAvatar'

const FeedReferenceItem = ({ feedId }: { feedId: string }) => {
  const { feed } = useFeedGetById(feedId)

  if (!feed) return null

  return (
    <>
      <div className={'mb-2'}>
        <div className={'items-center flex justify-between h-5 mb-2 w-full'}>
          <div className={'flex flex-1 items-center'}>
            <UserHoverAvatar user={feed.user}>
              <Link
                href={`/space/${feed.user.id}`}
                className={'cursor-pointer size-5 mr-1 inline-block '}
              >
                <UserAvatar avatar={feed.user.avatar} h={20} w={20} />
              </Link>
            </UserHoverAvatar>

            <UserHoverAvatar user={feed.user}>
              <Link
                href={`/space/${feed.user.id}`}
                className={'cursor-pointer text-[15px] leading-[25px] text-text2 inline-block'}
              >
                {feed.user.name}
              </Link>
            </UserHoverAvatar>
            {feed.type === 'video' && (
              <span className={'text-text3 ml-1 text-[15px] leading-[25px]'}>投稿了视频</span>
            )}
          </div>
        </div>
      </div>
      {feed.title && (
        <Link
          href={`/feed/${feed.id}`}
          className={
            'line-clamp-2 cursor-pointer block text-[15px] font-bold leading-[25px] my-1 break-all break-words text-ellipsis'
          }
        >
          {feed.title}
        </Link>
      )}
      {feed.content && (
        <div>
          <FeedCollapsibleContent content={feed.content} feedId={feed.id} />
        </div>
      )}
      {!!feed.images?.length && (
        <div className={'mt-3 font-normal antialiased'}>
          <FeedImagesViewer images={feed.images} />
        </div>
      )}
      {feed.video && (
        <div>
          <FeedVideoContent feed={feed} />
        </div>
      )}
    </>
  )
}

export default FeedReferenceItem
