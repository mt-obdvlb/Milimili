'use client'

import { useSearchParams } from 'next/navigation'
import { FavoriteIds, useFavoriteDetail, useFavoriteList } from '@/features'
import { useState } from 'react'
import Image from 'next/image'
import SpaceCommonPagination from '@/features/space/components/common/SpaceCommonPagination'
import TinyVideoItem from '@/components/layout/video/TinyVideoItem'
import { FavoriteListSort } from '@mtobdvlb/shared-types'
import { Button } from '@/components'
import SpaceFavoriteFilterWrapper from '@/features/space/components/favorite/SpaceFavoriteFilterWrapper'
import FavoriteCheckBox from '@/features/favorite/components/FavoriteCheckBox'
import { useUserStore } from '@/stores'

const SpaceFavoriteWrapper = ({ userId }: { userId: string }) => {
  const searchParams = useSearchParams()
  const folderId = searchParams.get('folderId')
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState<FavoriteListSort>('favoriteAt')
  const [kw, setKw] = useState('')
  const [isSelect, setIsSelect] = useState(Boolean)
  const [ids, setIds] = useState<FavoriteIds>([])
  const user = useUserStore((state) => state.user)

  const { favoriteList, total } = useFavoriteList({
    page,
    pageSize: 50,
    favoriteFolderId: folderId ?? '',
    sort,
    kw,
  })
  const { favoriteDetail } = useFavoriteDetail(folderId ?? '')
  if (!folderId || !user?.id) return null

  return (
    <>
      <div className={'h-[137px] pb-6 border-b border-b-line_regular flex relative'}>
        <div className={'pt-3 w-[178px] shrink-0 h-[112px]'}>
          <div className={'relative'}>
            <div className={'relative overflow-hidden rounded-[6px] bg-graph_bg_thick'}>
              <div className={'overflow-hidden relative pt-[56.25%] '}>
                <div className={'absolute inset-0'}>
                  {favoriteDetail?.name && (
                    <Image
                      src={favoriteDetail?.thumbnail ?? '/images/default-favorite-folder.png'}
                      alt={favoriteDetail?.name}
                      width={100}
                      height={100}
                      className={'size-full object-cover'}
                    />
                  )}
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
        <div className={'w-[calc(100%-196px)] ml-4.5 flex flex-col justify-between'}>
          <div className={'text-[20px] font-medium leading-7 text-text1'}>
            <div className={'line-clamp-1 text-ellipsis'}>{favoriteDetail?.name ?? ''}</div>
            <div className={'font-normal mt-1 text-sm text-text3 leading-[17px]'}>
              {`公开 视频数: ${favoriteDetail?.number ?? 0}`}
            </div>
          </div>
          <div className={'mt-2 flex w-full justify-end'}>
            <Button
              className={
                'text-text1 border border-line_regular transition duration-200 bg-bg1_float h-[34px] w-24 px-xsm rounded-md text-4 whitespace-nowrap select-none cursor-pointer hover:bg-line_regular'
              }
              onClick={() => setIsSelect(!isSelect)}
            >
              {isSelect ? '返回' : '批量操作'}
            </Button>
          </div>
        </div>
      </div>
      <div>
        <div className={'mt-6 text-sm'}>
          <SpaceFavoriteFilterWrapper
            ids={ids}
            setIds={setIds}
            isSelect={isSelect}
            sort={sort}
            setSort={setSort}
            setKw={setKw}
            kw={kw}
            favoriteList={favoriteList}
            folder={favoriteDetail}
            setIsSelect={setIsSelect}
            isMe={user.id === userId}
          />
        </div>
        <div className={'grid grid-cols-5 mt-6 gap-x-4 gap-y-5'}>
          {favoriteList.map((item) => (
            <div key={item.id} className={'relative'}>
              <TinyVideoItem
                video={{
                  ...item.video,
                  userId: item.user.id,
                  username: item.user.name,
                  favoriteAt: item.favoriteAt,
                }}
                key={item.id}
                showWatchLater={favoriteDetail?.type !== 'watch_later'}
                hiddenPublishAt
                showFavoriteAt
              />
              {isSelect && (
                <FavoriteCheckBox
                  setIds={setIds}
                  id={{
                    favoriteId: item.id,
                    videoId: item.video.id,
                  }}
                  ids={ids}
                />
              )}
              {user.id === userId}
            </div>
          ))}
        </div>
        <div className={'py-15 w-fit mx-auto'}>
          <SpaceCommonPagination page={page} setPage={setPage} total={total} />
        </div>
      </div>
    </>
  )
}

export default SpaceFavoriteWrapper
