'use client'
import { cn, toast } from '@/lib'
import { formatPlayCount } from '@/utils'
import { useFavoriteAddBatch, useFavoriteGetByVideoId, useFavoriteGetFolderList } from '@/features'
import { VideoGetDetail } from '@mtobdvlb/shared-types'
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
} from '@/components'
import FavoriteAddModel from '@/components/layout/models/favorite-add-model/FavoriteAddModel'
import { useState } from 'react'

const VideoFavorite = ({
  videoDetail,
  className,
}: {
  videoDetail: VideoGetDetail
  className?: string
}) => {
  const { favoriteAdd } = useFavoriteAddBatch()
  const { isFavorite } = useFavoriteGetByVideoId(videoDetail.video.id)
  const { favoriteFolderList } = useFavoriteGetFolderList()

  const [selectFolderIds, setSelectFolderIds] = useState<string[]>([])

  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className={'relative mr-2'}>
          {isFavorite !== undefined && (
            <div
              className={cn(
                'relative flex hover:text-brand_blue items-center w-[92px] whitespace-nowrap transition-all duration-300 text-[13px] text-text2 font-medium cursor-pointer',
                className,
                isFavorite && 'text-brand_blue'
              )}
            >
              <svg
                width='28'
                height='28'
                viewBox='0 0 28 28'
                xmlns='http://www.w3.org/2000/svg'
                className={'mr-2 size-7 shrink-0'}
              >
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M19.8071 9.26152C18.7438 9.09915 17.7624 8.36846 17.3534 7.39421L15.4723 3.4972C14.8998 2.1982 13.1004 2.1982 12.4461 3.4972L10.6468 7.39421C10.1561 8.36846 9.25639 9.09915 8.19315 9.26152L3.94016 9.91102C2.63155 10.0734 2.05904 11.6972 3.04049 12.6714L6.23023 15.9189C6.96632 16.6496 7.29348 17.705 7.1299 18.7605L6.39381 23.307C6.14844 24.6872 7.62063 25.6614 8.84745 25.0119L12.4461 23.0634C13.4276 22.4951 14.6544 22.4951 15.6359 23.0634L19.2345 25.0119C20.4614 25.6614 21.8518 24.6872 21.6882 23.307L20.8703 18.7605C20.7051 17.705 21.0339 16.6496 21.77 15.9189L24.9597 12.6714C25.9412 11.6972 25.3687 10.0734 24.06 9.91102L19.8071 9.26152Z'
                  fill='currentColor'
                ></path>
              </svg>
              <span className={'overflow-hidden text-ellipsis break-words whitespace-nowrap'}>
                {videoDetail.video.favorites
                  ? formatPlayCount(videoDetail.video.favorites)
                  : '收藏'}
              </span>
            </div>
          )}
        </div>
      </DialogTrigger>
      <DialogContent className={'w-[420px] rounded-[4px]'}>
        <DialogHeader className={''}>
          <DialogTitle
            className={
              'relative px-5 h-[50px] leading-[50px] text-[16px] text-text1 border-b-line_regular flex justify-center items-center'
            }
          >
            添加到收藏夹
          </DialogTitle>
        </DialogHeader>
        <div className={'px-9 h-[300px] overflow-auto'}>
          <div className={'max-h-[300px] pb-[14px]'}>
            <ul className={'relative mt-6 min-h-[210px]'}>
              {favoriteFolderList?.map((item) => (
                <li key={item.id} className={'pb-6  text-sm '}>
                  <Label
                    className={
                      'cursor-pointer hover:text-brand_blue group flex items-center justify-between'
                    }
                  >
                    <div>
                      <Input
                        checked={selectFolderIds.includes(item.id)}
                        onChange={() => {
                          if (selectFolderIds.includes(item.id)) {
                            setSelectFolderIds(selectFolderIds.filter((id) => id !== item.id))
                          } else {
                            setSelectFolderIds([...selectFolderIds, item.id])
                          }
                        }}
                        type={'checkbox'}
                        className={'size-0 cursor-pointer align-middle hidden'}
                      />
                      <i
                        className={cn(
                          "size-[20px] inline-block mr-4.5 align-middle bg-[url('/images/video-favorite-checkbox.png')]",
                          selectFolderIds.includes(item.id)
                            ? "bg-[url('/images/video-favorite-checkbox-checked.png')]"
                            : "group-hover:bg-[url('/images/video-favorite-checkbox-hover.png')]"
                        )}
                      ></i>
                      <span
                        className={
                          'max-w-[220px] inline-block overflow-hidden text-ellipsis whitespace-nowrap align-middle'
                        }
                      >
                        {item.name}
                      </span>
                    </div>
                    <span className={' text-xs text-text2'}>{item.number}</span>
                  </Label>
                </li>
              ))}
            </ul>
            <FavoriteAddModel>
              <div className={'mb-[5px] w-[348px]'}>
                <Button
                  className={
                    "border w-full px-[34px] text-start hover:border-brand_blue h-[34px] border-text3 leading-[34px] rounded-[4px] text-xs text-text2 cursor-pointer bg-no-repeat bg-[url('/images/video-favorite-plus.png')] bg-[10px_center]"
                  }
                >
                  新建收藏夹
                </Button>
              </div>
            </FavoriteAddModel>
          </div>
        </div>
        <DialogFooter className={'h-[76px] text-center mx-9 border-t border-t-line_regular'}>
          <Button
            disabled={!selectFolderIds.length}
            className={cn(
              'text-sm w-40 h-10 mt-4.5 rounded-[4px]   text-text3 bg-graph_bg_thick',
              !!selectFolderIds.length && 'bg-brand_blue cursor-pointer text-white'
            )}
            onClick={async () => {
              await Promise.all(
                selectFolderIds.map(async (folderId) => {
                  const { code } = await favoriteAdd({
                    videoIds: [videoDetail.video.id],
                    folderId,
                  })
                  if (code) return
                  setIsOpen(false)
                  toast('已收藏')
                })
              )
            }}
          >
            确定
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default VideoFavorite
