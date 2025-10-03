import { useFeedGetListLikeTranspont } from '@/features'
import { useInfiniteScroll } from '@/hooks'
import UserAvatar, { UserHoverAvatar } from '@/components/ui/UserAvatar'
import { openNewTab } from '@/utils'

const FeedDetailLikeTranspontList = ({ feedId }: { feedId: string }) => {
  const { likeTranspotList, fetchNextPage } = useFeedGetListLikeTranspont({ feedId })

  const { ref: infiniteScrollRef } = useInfiniteScroll(fetchNextPage)

  return (
    <>
      {likeTranspotList.map((item, index) => (
        <div
          className={'flex items-center py-4 shadow-[0_-.5px_0_0_var(--line_regular)_inset]'}
          key={index}
        >
          <UserHoverAvatar user={item.user}>
            <div
              onClick={() => openNewTab(`/space/${item.user.id}`)}
              className={'size-10 shrink-0 rounded-full overflow-hidden cursor-pointer mr-4'}
            >
              <div className={'size-full bg-bg3'}>
                <UserAvatar avatar={item.user.avatar} h={40} w={40} />
              </div>
            </div>
          </UserHoverAvatar>
          <div className={'flex-1 overflow-hidden'}>
            <div
              onClick={() => openNewTab(`/space/${item.user.id}`)}
              className={'text-[15px] font-medium leading-[21px] cursor-pointer text-text1'}
            >
              {item.user.name}
              <div className={'inline-block font-normal ml-1.5'}>
                {item.type === 'like' ? '赞了' : '转发了'}
              </div>
            </div>
          </div>
        </div>
      ))}
      <div ref={infiniteScrollRef} className={'py-5 text-[13px] text-text3 text-center'}>
        没有更多了
      </div>
    </>
  )
}

export default FeedDetailLikeTranspontList
