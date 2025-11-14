import { SearchGetItem, SearchRecommendUser } from '@mtobdvlb/shared-types'
import { tv } from 'tailwind-variants'
import { cn } from '@/lib'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components'
import SearchUserVideoItem from '@/features/search/components/SearchUserVideoItem'
import SearchVideoItem from '@/features/search/components/SearchVideoItem'
import { Dispatch, SetStateAction } from 'react'
import SearchEmpty from '@/features/search/components/SearchEmpty'
import SearchPagination from '@/features/search/components/SearchPagination'
import SearchFollowBtn from '@/features/search/components/SearchFollowBtn'

const SearchAllList = ({
  searchUser,
  searchList,
  total,
  page,
  setPage,
}: {
  searchList?: SearchGetItem[]
  searchUser?: SearchRecommendUser
  total: number
  page: number
  setPage: Dispatch<SetStateAction<number>>
}) => {
  const searchAllStyles = tv({
    slots: {
      base: 'min-h-50',
      userContainer: cn('relative py-[30px]'),
      videoContainer: cn('pt-16 px-16 w-full max-w-[2200px] mx-auto'),
    },
  })

  const { base, userContainer, videoContainer } = searchAllStyles()

  if (total === 0) return <SearchEmpty />

  return (
    <>
      <div className={base()}>
        {searchUser && (
          <>
            <div className={userContainer()}>
              <div className={'mx-auto w-full max-w-[2200px] px-16'}>
                <div className={'relative flex h-[68px] items-center justify-start'}>
                  <Link href={`/apps/web/src/app/(with-auth)/space/${searchUser?.user.id}`}>
                    <div
                      className={
                        'relative -mt-[9px] mr-[7px] mb-auto -ml-[9px] w-[86px] min-w-[86px] cursor-pointer'
                      }
                    >
                      <div className={'relative h-[86px] w-full scale-80'}>
                        <div
                          className={
                            "relative block size-[86px] translate-0 cursor-pointer rounded-full bg-[url('/images/avatar.jpg')] bg-cover"
                          }
                        >
                          <Image
                            src={searchUser.user.avatar}
                            alt={searchUser.user.name}
                            className={
                              'border-line_light absolute top-[50%] left-[50%] block size-full -translate-[50%] rounded-full border object-cover'
                            }
                            width={68}
                            height={68}
                          />
                        </div>
                      </div>
                    </div>
                  </Link>
                  <div className={'w-[calc(100%-68px-15px)]'}>
                    <h2 className={'text-text1 mt-0 mb-[5px] text-[18px] leading-[1.25] font-bold'}>
                      <Link
                        href={`/apps/web/src/app/(with-auth)/space/${searchUser.user.id}`}
                        className={
                          'hover:text-brand_blue inline-block max-w-full cursor-pointer overflow-hidden align-middle text-[18px] font-semibold text-ellipsis whitespace-nowrap transition-colors duration-200'
                        }
                      >
                        {searchUser.user.name}
                      </Link>
                      <div className={'ml-2 inline-block'}>
                        <SearchFollowBtn followingId={searchUser.user.id} />
                      </div>
                    </h2>
                    <p
                      className={
                        'text-text2 my-[5px] mt-2 block w-auto max-w-full overflow-hidden text-sm leading-[1.35] font-normal text-ellipsis whitespace-nowrap'
                      }
                    >
                      {`粉丝: ${searchUser.user.followers} · 视频: ${searchUser.user.videos}`}
                    </p>
                  </div>
                </div>
                <div className={'relative mt-[15px]'}>
                  <div className={'-mx-[calc(16px*0.5)] flex flex-wrap'}>
                    {searchUser.video.map((item, index) => (
                      <SearchUserVideoItem
                        video={{
                          ...item,
                          userId: searchUser.user.id,
                          username: searchUser.user.name,
                        }}
                        key={index}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className={'ma-w-[2200px] relative mx-auto w-full px-16'}>
              <div className={'border-b-line_light border-b'}></div>
              <Button
                className={
                  'text-brand_blue bg-bg1 hover:bg-brand_blue_thin absolute top-[50%] left-[50%] z-1 inline-flex h-8 min-w-[100px] -translate-[50%] cursor-pointer items-center rounded-[8px] border-none px-[15px] text-sm leading-[1] whitespace-nowrap transition-all duration-200 select-none'
                }
              >
                查看TA的所有稿件
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                  width='24'
                  height='24'
                  className={'ml-[2px] size-[13px]'}
                >
                  <path
                    d='M8.5429 3.04289C8.15237 3.43342 8.15237 4.06658 8.5429 4.45711L15.909 11.8232C16.0066 11.9209 16.0066 12.0791 15.909 12.1768L8.5429 19.5429C8.15237 19.9334 8.15237 20.5666 8.5429 20.9571C8.93342 21.3476 9.56659 21.3476 9.95711 20.9571L17.3232 13.591C18.2019 12.7123 18.2019 11.2877 17.3232 10.409L9.95711 3.04289C9.56659 2.65237 8.93342 2.65237 8.5429 3.04289z'
                    fill='currentColor'
                  ></path>
                </svg>
              </Button>
            </div>
          </>
        )}
        <div className={videoContainer()}>
          <div className={'-mx-[calc(16px*0.5)] flex flex-wrap'}>
            {searchList?.map((item, index) => (
              <SearchVideoItem video={item} key={index} />
            ))}
          </div>
        </div>
      </div>
      <SearchPagination page={page} pageSize={30} total={total} setPage={setPage} />
    </>
  )
}

export default SearchAllList
