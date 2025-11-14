'use client'

import { useVideoDelete, useVideoPageList } from '@/features'
import { useState } from 'react'
import { VideoListSort } from '@mtobdvlb/shared-types'
import { useUserStore } from '@/stores'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import SpaceCommonPagination from '@/features/space/components/common/SpaceCommonPagination'
import Link from 'next/link'
import Image from 'next/image'
import { formatTime, formatWatchAt } from '@/utils'
import { SquarePen, Trash2 } from 'lucide-react'
import { Button } from '@/components'
import CommonDialog from '@/components/layout/models/common/CommonDialog'
import { toast } from '@/lib'

const PlatformUploadManagerWrapper = () => {
  const [sort, setSort] = useState<VideoListSort>('publishedAt')
  const [page, setPage] = useState(1)
  const user = useUserStore((state) => state.user)
  const { total, videoPageList } = useVideoPageList({ page, sort, pageSize: 10, userId: user?.id })
  const { deleteVideo } = useVideoDelete()

  return (
    <div className={'w-full'}>
      <div className={'mb-[26px] justify-between flex relative items-center mt-2 h-8'}>
        <div className={'flex items-center'}>
          <div
            className={
              'text-brand_blue text-sm tracking-[0.5px] text-center leading-4.5 cursor-pointer relative pr-4 select-none'
            }
          >
            全部稿件 {total}
          </div>
        </div>
        <div className={'w-[164px] ml-3 relative'}>
          <Select onValueChange={(value) => setSort(value as VideoListSort)} value={sort}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent sideOffset={0}>
              {[
                { value: 'publishedAt', label: '投稿时间排序' },
                { value: 'views', label: '播放量排序' },
                { value: 'favorites', label: '收藏量排序' },
              ].map((item) => (
                <SelectItem value={item.value} key={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <div className={'mt-2'}>
          {videoPageList.map((item) => (
            <div
              className={
                'flex py-6 relative w-full min-h-[140px] rounded-[4px] bg-white border-b border-b-[rgb(231,231,231)]'
              }
              key={item.id}
            >
              <Link
                href={`/apps/web/src/app/(with-auth)/video/${item.id}`}
                className={
                  'self-center w-[154px] h-[87px] mr-6 relative rounded-[4px] overflow-hidden '
                }
                target={'_blank'}
              >
                {item.thumbnail && (
                  <Image
                    src={item.thumbnail}
                    alt={'视频'}
                    className={'size-full rounded-[4px]'}
                    height={180}
                    width={154}
                  />
                )}
                <div
                  className={
                    'bg-black/50 text-xs rounded-[4px_0px] absolute h-4.5 leading-4.5 px-1 text-white bottom-0 right-0'
                  }
                >
                  {formatTime(item.time)}
                </div>
              </Link>
              <div className={'w-[calc(100%-178px)] relative'}>
                <div className={'h-6 leading-6'}>
                  <Link
                    href={`/apps/web/src/app/(with-auth)/video/${item.id}`}
                    target={'_blank'}
                    className={
                      'cursor-pointer hover:text-brand_blue text-[16px] text-text1 leading-5 align-middle inline-block max-w-[420px] overflow-hidden line-clamp-1 text-ellipsis'
                    }
                  >
                    {item.title}
                  </Link>
                </div>
                <div className={'w-full flex justify-between items-center'}>
                  <div
                    className={
                      'pt-4.5 pb-4 text-sm  mr-1 flex items-start text-[rgb(80,80,80)] leading-5 pr-6'
                    }
                  >
                    <span className={'inline-block min-w-[175px]'}>
                      {formatWatchAt(item.publishedAt)}
                    </span>
                  </div>
                  <div className={'flex relative top-1/2 text-[#99a2aa]'}>
                    <Link
                      className={
                        'hover:text-brand_blue hover:border-brand_blue justify-center border w-21 h-[32px] flex items-center border-[rgb(231,231,231)] rounded-[2px] text-sm text-center cursor-pointer text-[rgb(80,80,80)] leading-4.5 '
                      }
                      href={`/apps/web/src/app/(with-auth)/platform/upload?videoId=${item.id}`}
                    >
                      <SquarePen className={'text-[16px] mr-[7px] size-4'} />
                      编辑
                    </Link>
                    <CommonDialog
                      handleConfirm={async () => {
                        const { code } = await deleteVideo(item.id)
                        if (code) return
                        toast('已删除')
                      }}
                      title={'您确定要删除稿件吗'}
                      trigger={
                        <Button
                          className={
                            'hover:text-brand_blue ml-3 hover:border-brand_blue justify-center border w-21 h-[32px] flex items-center border-[rgb(231,231,231)] rounded-[2px] text-sm text-center cursor-pointer text-[rgb(80,80,80)] leading-4.5 '
                          }
                        >
                          <Trash2 className={'text-[16px] mr-[7px] size-4'} />
                          删除
                        </Button>
                      }
                    />
                  </div>
                </div>
                <div className={'relative text-xs flex'}>
                  {[
                    { icon: '/images/view.png', num: item.views },
                    { icon: '/images/like.png', num: item.likes },
                    { icon: '/images/danmaku.png', num: item.danmakus },
                    { icon: '/images/comment.png', num: item.comments },
                    { icon: '/images/favorite.png', num: item.favorites },
                    { icon: '/images/share.png', num: item.shares },
                  ].map((item) => (
                    <div key={item.icon} className={'flex items-center mr-[25px] text-text3 '}>
                      <Image src={item.icon} alt={'icon'} width={18} height={18} />
                      <span className={'ml-[5px]'}>{item.num}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        <SpaceCommonPagination page={page} setPage={setPage} total={total} />
      </div>
    </div>
  )
}

export default PlatformUploadManagerWrapper
