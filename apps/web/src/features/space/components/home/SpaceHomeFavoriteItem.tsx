'use client'
import { FavoriteFolderListItem } from '@mtobdvlb/shared-types'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

const SpaceHomeFavoriteItem = ({
  favoriteFolder,
  userId,
}: {
  favoriteFolder: FavoriteFolderListItem
  userId: string
}) => {
  const router = useRouter()

  return (
    <div className={'h-full pt-4'}>
      <div
        onClick={() => router.push(`/space/${userId}/favorite/${favoriteFolder.id}`)}
        className={'relative bg-[#c9ccd0] rounded-[6px] cursor-pointer'}
      >
        <div className={'relative'}>
          <div className={'relative overflow-hidden '}>
            <div
              className={'rounded-[6px] relative  pt-[56.25%] bg-graph_bg_thick overflow-hidden'}
            >
              <div className={'size-full absolute top-0 left-0 rounded-[6px] '}>
                <Image
                  src={favoriteFolder.thumbnail ?? '/images/favorite-folder.png'}
                  className={'size-full rounded-[6px] block object-cover object-center  '}
                  alt={favoriteFolder.name}
                  width={100}
                  height={100}
                />
              </div>
              <div
                className={
                  'absolute bottom-0 left-0 z-2 w-full rounded-b-[6px] bg-[linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,.8)] text-white opacity-100 flex items-center justify-between pointer-events-none px-2 pt-[14px] pb-1 transition-all duration-200'
                }
              >
                <div
                  className={
                    'flex items-center text-[13px] h-4.5 overflow-hidden flex-1 justify-end '
                  }
                >
                  <span className={'whitespace-nowrap  text-ellipsis overflow-hidden'}>
                    {favoriteFolder.number}个视频
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div
            className={
              'absolute bg-graph_bg_regular w-9/10 h-4 rounded-[6px] -top-2 inset-x-0 m-auto -z-5'
            }
          ></div>
          <div
            className={
              'absolute bg-graph_bg_thin w-4/5 h-4 rounded-[6px] -top-4 inset-x-0 m-auto -z-10'
            }
          ></div>
        </div>
      </div>
      <div
        className={
          'cursor-pointer max-w-full mt-2.5 font-medium text-[16px] leading-[1.5] text-text1'
        }
      ></div>
    </div>
  )
}

export default SpaceHomeFavoriteItem
