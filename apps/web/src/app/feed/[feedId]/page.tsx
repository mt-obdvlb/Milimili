import HeaderBarWrapper from '@/components/layout/header/header-bar/HeaderBarWrapper'
import FeedDetailMainWrapper from '@/features/feed/components/detail/FeedDetailMainWrapper'
import { feedGetById } from '@/services'
import { cn } from '@/lib'
import FeedDetailToolBar from '@/features/feed/components/detail/FeedDetailToolBar'

const FeedDetail = async ({ params }: { params: Promise<{ feedId: string }> }) => {
  const { feedId } = await params
  const { data: feed } = await feedGetById(feedId)

  return (
    <>
      <header className={'min-h-16'}>
        <HeaderBarWrapper isFixed={true} />
      </header>
      <div className={'mx-auto pt-2 min-h-screen min-w-[1044px] max-w-[2560px] relative'}>
        <div
          className={
            'pointer-events-none z-0 fixed left-1/2 -translate-x-1/2 w-full top-0 h-screen bg-[#d3e9e8]'
          }
        ></div>
        <div
          className={
            "bg-[url('/images/feed-bg.png')] bottom-0 h-[56.25vw] bg-no-repeat bg-cover bg-bottom transition duration-300 pointer-events-none z-0 fixed left-1/2 -translate-x-1/2 w-full"
          }
        ></div>

        {feed && (
          <div
            className={cn(
              'z-2 relative mx-auto',
              feed.type === 'image-text' ? 'w-[708px]' : 'w-[632px]'
            )}
          >
            <FeedDetailMainWrapper feed={feed} />
            <FeedDetailToolBar feed={feed} />
          </div>
        )}
      </div>
    </>
  )
}

export default FeedDetail
