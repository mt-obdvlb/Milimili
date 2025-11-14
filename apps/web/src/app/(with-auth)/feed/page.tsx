import HeaderBarWrapper from '@/components/layout/header/header-bar/HeaderBarWrapper'
import ToTopBtn from '@/components/ui/ToTopBtn'
import { cn } from '@/lib'
import { getSearchLogTop10, getUserHomeInfo } from '@/features'
import FeedAsideTop10List from '@/features/feed/components/FeedAsideTop10List'
import Image from 'next/image'
import Link from 'next/link'
import FeedMainWrapper from '@/features/feed/components/FeedMainWrapper'

const Feed = async () => {
  const [{ searchLogTop10List }, { userHomeInfo }] = await Promise.all([
    getSearchLogTop10(),
    getUserHomeInfo(),
  ])

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
        <div className={'z-2 flex justify-center mx-auto min-h-[150vh] relative'}>
          <aside className={'w-[264px] shrink-0 relative mr-3 '}>
            <section className={'w-full mb-2'}>
              <div className={'py-5 px-4 bg-bg1 rounded-[6px]'}>
                {userHomeInfo && (
                  <>
                    <Link
                      target={'_blank'}
                      href={`/space/${userHomeInfo.user.id}`}
                      className={'flex  items-center mb-[17px]'}
                    >
                      <div
                        className={
                          'size-12 rounded-full overflow-hidden mr-2 cursor-pointer bg-[#f1f2f3] relative'
                        }
                      >
                        <Image
                          className={'size-full inline-block align-middle'}
                          fill
                          src={userHomeInfo.user.avatar}
                          alt={userHomeInfo.user.name}
                        />
                      </div>
                      <div className={'flex-1 min-w-[30px] h-12 '}>
                        <div
                          className={
                            'cursor-pointer text-ellipsis overflow-hidden whitespace-nowrap text-[15px] font-semibold mt-1 text-text1'
                          }
                        >
                          {userHomeInfo.user.name}
                        </div>
                      </div>
                    </Link>
                    <div>
                      <div className={'flex justify-between text-center'}>
                        {[
                          {
                            name: '关注',
                            href: `/space/${userHomeInfo.user.id}`,
                            num: userHomeInfo.followings,
                          },
                          {
                            name: '粉丝',
                            href: `/space/${userHomeInfo.user.id}`,
                            num: userHomeInfo.followers,
                          },
                          {
                            name: '动态',
                            href: `/space/${userHomeInfo.user.id}`,
                            num: userHomeInfo.feeds,
                          },
                        ].map((item) => (
                          <Link
                            className={
                              'max-w-[40%] min-w-10 flex flex-col justify-between cursor-pointer'
                            }
                            target={'_blank'}
                            href={item.href}
                            key={item.name}
                          >
                            <div
                              className={
                                'overflow-hidden text-ellipsis whitespace-nowrap h-5 font-semibold leading-5 text-[15px] text-text1'
                              }
                            >
                              {item.num}
                            </div>
                            <div
                              className={'h-[17px] leading-[17px] mt-0.5 text-[13px] text-text3'}
                            >
                              {item.name}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </section>
          </aside>
          <FeedMainWrapper />
          <aside className={'w-[318px] shrink-0 relative'}>
            <FeedAsideTop10List searchLogTop10List={searchLogTop10List} />
          </aside>
          <div className={'right-2.5 fixed bottom-5 w-[42px] h-[150px] text-xs'}>
            <ToTopBtn
              inlineClassName={cn(
                ' transition-all duration-200 bg-bg1_float shadow-[0_0_10px_rgba(0,0,0,.08)]'
              )}
              isShow={true}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default Feed
