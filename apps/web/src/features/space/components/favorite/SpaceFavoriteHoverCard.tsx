'use client'

import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components'
import { cn, toast } from '@/lib'
import FavoriteAddModel from '@/components/layout/models/favorite-add-model/FavoriteAddModel'
import CommonDialog from '@/components/layout/models/common/CommonDialog'
import { FavoriteFolderListItem } from '@mtobdvlb/shared-types'
import { useFavoriteFolderDelete } from '@/features'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

const SpaceFavoriteHoverCard = ({
  item,
  folderId,
}: {
  item: FavoriteFolderListItem
  folderId: string | null
}) => {
  const router = useRouter()
  const pathname = usePathname()
  const { favoriteFolderDelete } = useFavoriteFolderDelete()
  const [favoriteOpen, setFavoriteOpen] = useState(false)
  return (
    <>
      <FavoriteAddModel open={favoriteOpen} setOpen={setFavoriteOpen} folderId={item.id}>
        <div></div>
      </FavoriteAddModel>
      <HoverCard closeDelay={50} openDelay={10}>
        <HoverCardTrigger asChild>
          <div
            className={
              'absolute right-0 opacity-0  group-hover:opacity-100 data-[state=open]:opacity-100 peer'
            }
          >
            <i
              className={cn(
                'sic-BDC-more_vertical_fill text-[20px] text-white translate-x-[5px]',
                item.id === folderId ? 'text-white' : 'text-text1'
              )}
            ></i>
          </div>
        </HoverCardTrigger>
        <HoverCardContent className={'shadow-[0_8px_40px] shadow-black/10 rounded-[12px] z-10000 '}>
          <div className='min-w-[122px] py-3 bg-bg1_float rounded-[8px] text-center'>
            {/* 编辑信息 */}
            <div
              onClick={() => setFavoriteOpen(true)}
              className='cursor-pointer text-text2 hover:bg-line_regular text-sm h-10 leading-10 px-6 relative bg-bg1_float'
            >
              编辑信息
            </div>
            {/* 删除 */}
            {item.type === 'normal' && (
              <CommonDialog
                title='你确定要删除吗'
                handleConfirm={async () => {
                  const { code } = await favoriteFolderDelete(item.id)
                  if (code) return
                  toast('已删除')
                  if (item.id === folderId) {
                    router.push(pathname)
                  }
                }}
                trigger={
                  <div className='cursor-pointer text-text2 hover:bg-line_regular text-sm h-10 leading-10 px-6 relative bg-bg1_float'>
                    删除
                  </div>
                }
              />
            )}
          </div>
        </HoverCardContent>
      </HoverCard>
    </>
  )
}

export default SpaceFavoriteHoverCard
