'use client'

import { useSearchParams } from 'next/navigation'
import { useFavoriteDetail, useFavoriteList } from '@/features'
import { useState } from 'react'
import Image from 'next/image'
import SpaceCommonPagination from '@/features/space/components/common/SpaceCommonPagination'
import TinyVideoItem from '@/components/layout/video/TinyVideoItem'

const SpaceFavoriteWrapper = ({ userId }: { userId: string }) => {
  const searchParams = useSearchParams()
  const folderId = searchParams.get('folderId')
  const [page, setPage] = useState(1)

  const { favoriteList, total } = useFavoriteList({
    page,
    pageSize: 50,
    userId,
    favoriteFolderId: folderId ?? '',
  })
  const { favoriteDetail } = useFavoriteDetail(folderId ?? '')
  if (!folderId) return null

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
      </div>
      <div>
        <div className={'grid grid-cols-5 mt-6 gap-x-4 gap-y-5'}>
          {favoriteList.map((item) => (
            <TinyVideoItem
              video={{
                ...item.video,
                userId: item.user.id,
                username: item.user.name,
              }}
              key={item.id}
            />
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
