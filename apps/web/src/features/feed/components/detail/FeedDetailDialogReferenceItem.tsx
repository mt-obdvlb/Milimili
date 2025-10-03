import { useFeedGetById } from '@/features'
import FeedVideoContent from '@/features/feed/components/FeedVideoContent'
import WithAt from '@/components/hoc/WithAt'

const FeedDetailDialogReferenceItem = ({ feedId }: { feedId: string }) => {
  const { feed } = useFeedGetById(feedId)
  if (!feed) return null
  return (
    <div className={'bg-bg3 rounded-[4px] py-2.5 px-3 '}>
      <div className={'flex items-center h-6 mb-2 w-full'}>
        <div className={'line-clamp-1 text-ellipsis text-sm text-text1 break-all break-words'}>
          @{feed.user.name}
        </div>
      </div>
      <div className={'pointer-events-none'}>
        {feed.type === 'video' ? (
          <>
            <FeedVideoContent feed={feed} />
          </>
        ) : (
          <div className={'flex'}>
            <div className={'rounded-[6px] shrink-0 size-[96px] mr-2 overflow-hidden'}>
              <picture className={'bg-bg3 size-full '}>
                <img alt={feed.content} src={feed.images?.[0] || feed.user.avatar} />
              </picture>
            </div>
            <div className={'flex-1'}>
              <div className={'text-sm font-normal whitespace-pre-wrap  break-words'}>
                <div
                  className={'leading-[23px] max-h-[113px] line-clamp-4 text-ellipsis  text-text1'}
                >
                  <WithAt>{feed.content ?? ''}</WithAt>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default FeedDetailDialogReferenceItem
