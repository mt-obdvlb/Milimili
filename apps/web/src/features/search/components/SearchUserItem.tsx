import Link from 'next/link'
import Image from 'next/image'
import { type SearchUserItem } from '@mtobdvlb/shared-types'
import SearchFollowBtn from '@/features/search/components/SearchFollowBtn'

const SearchUserItem = ({ user }: { user?: SearchUserItem }) => {
  if (!user) return null
  return (
    <div className={'relative mb-15 w-full max-w-1/2 flex-[0_0_50%] px-[calc(16px*0.5)]'}>
      <div className={'flex items-center justify-start'}>
        <Link className={'mr-[15px]'} href={`/apps/web/src/app/(with-auth)/space/${user?.id}`}>
          <div className={'relative w-[86px] min-w-[86px] cursor-pointer'}>
            <div className={'relative h-[86px] w-full scale-80'}>
              <div
                className={
                  "relative block size-[86px] translate-0 cursor-pointer rounded-full bg-[url('/images/avatar.jpg')] bg-cover"
                }
              >
                <Image
                  src={user?.avatar ?? ''}
                  alt={user?.name ?? ''}
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
        <div className={'w-[calc(100%-101px)] pr-[15px]'}>
          <h2 className={'text-text1 mt-0 mb-[5px] text-lg leading-[1.25] font-bold'}>
            {user?.name}
          </h2>
          <p
            className={
              'my-[5px] block w-auto max-w-full overflow-hidden text-[13px] leading-[1.35] font-normal text-ellipsis whitespace-nowrap'
            }
          >{`${user?.followers}粉丝 · ${user?.videos}个视频`}</p>
          <div>
            <SearchFollowBtn className={'text-sm font-normal'} followingId={user!.id} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchUserItem
