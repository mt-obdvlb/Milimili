'use client'

import { useFavoriteGetFolderList } from '@/features'
import SpaceHomeHeader from '@/features/space/components/home/SpaceHomeHeader'
import SpaceHomeFavoriteItem from '@/features/space/components/home/SpaceHomeFavoriteItem'

const SpaceHomeFavoriteWrapper = ({ userId }: { userId: string }) => {
  const { favoriteFolderList } = useFavoriteGetFolderList(userId)
  return (
    <div className={'pb-6 border-b border-b-line_regular mb-6'}>
      <SpaceHomeHeader
        url={`/space/${userId}/favorite`}
        title={'收藏夹'}
        desc={favoriteFolderList?.length.toString()}
      />
      <div className={'grid grid-cols-5 gap-y-4 gap-x-5'}>
        {favoriteFolderList?.slice(0, 10)?.map((item) => (
          <SpaceHomeFavoriteItem userId={userId} key={item.id} favoriteFolder={item} />
        ))}
      </div>
    </div>
  )
}

export default SpaceHomeFavoriteWrapper
