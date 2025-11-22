'use client'

import { FavoriteIds } from '@/features'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Input, Tabs, TabsList, TabsTrigger } from '@/components'
import { FavoriteFolderListItem, FavoriteList, FavoriteListSort } from '@mtobdvlb/shared-types'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '@/lib'
import FavoriteAllCheck from '@/features/favorite/components/FavoriteAllCheck'
import FavoriteSelectFilterBtnWrapper from '@/features/favorite/components/FavoriteSelectFilterBtnWrapper'

const SpaceFavoriteFilterWrapper = ({
  isSelect,
  setIds,
  ids,
  sort,
  setSort,
  setKw,
  kw,
  favoriteList,
  folder,
  setIsSelect,
  isMe,
}: {
  isSelect: boolean
  ids: FavoriteIds
  setIds: Dispatch<SetStateAction<FavoriteIds>>
  sort: FavoriteListSort
  setSort: Dispatch<SetStateAction<FavoriteListSort>>
  kw: string
  setKw: Dispatch<SetStateAction<string>>
  favoriteList: FavoriteList
  folder?: FavoriteFolderListItem
  setIsSelect: Dispatch<SetStateAction<boolean>>
  isMe: boolean
}) => {
  const [input, setInput] = useState('')

  useEffect(() => {
    if (isSelect) {
      setInput('')
    } else {
      setInput(kw)
      setIds([])
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSelect, kw])

  useEffect(() => {
    if (folder?.id) {
      setKw('')
      setInput('')
      setSort('favoriteAt')
      setIds([])
      setIsSelect(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folder])

  return (
    <div className={'h-[34px] w-full flex justify-between items-center'}>
      <div className={'flex shrink-0 items-center'}>
        {isSelect ? (
          <>
            <FavoriteAllCheck
              totalNumber={favoriteList.length}
              allIds={favoriteList.map((item) => ({
                videoId: item.video.id,
                favoriteId: item.id,
              }))}
              setIds={setIds}
              ids={ids}
            />
            <span className={'text-sm ml-6 text-text2'}>{`已选择 ${ids.length} 个视频`}</span>
          </>
        ) : (
          <>
            <Tabs
              value={sort}
              onValueChange={(value) => setSort(value as FavoriteListSort)}
              className={'block size-full'}
            >
              <TabsList className={'flex text-sm gap-3 flex-wrap'}>
                {[
                  { label: '最近收藏', value: 'favoriteAt' },
                  {
                    value: 'views',
                    label: '最多播放',
                  },
                  {
                    label: '最新投稿',
                    value: 'publishedAt',
                  },
                ].map((item) => (
                  <TabsTrigger
                    className={
                      'flex items-center h-[34px] data-[state=active]:text-white data-[state=active]:bg-brand_blue px-[15px] text-text2 cursor-pointer transition-all duration-300 rounded-[6px] bg-graph_bg_thin'
                    }
                    key={item.value}
                    value={item.value}
                  >
                    {item.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </>
        )}
      </div>
      <div className={'flex gap-3 text-sm mr-6 shrink'}>
        {isSelect ? (
          <>
            <FavoriteSelectFilterBtnWrapper ids={ids} folder={folder} isMe={isMe} />
          </>
        ) : (
          <>
            <div className={'w-[211px]'}>
              <div
                className={
                  'w-full overflow-hidden inline-flex grow bg-bg1 border border-line_regular text-4 rounded-[6px] px-sm'
                }
              >
                <Input
                  type={'text'}
                  placeholder={'请输入关键字'}
                  className={'text-text1 h-h-md leading-md inline-flex w-full bg-transparent'}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <div className={'ml-2 inline-flex shrink-0 items-center'}>
                  <span
                    className={cn(
                      'mr-2.5 relative size-4 inline-flex items-center justify-center text-text3 text-[16px] shrink-0  transition duration-200',
                      !input.length && 'pointer-events-none'
                    )}
                    onClick={() => {
                      setKw('')
                      setInput('')
                    }}
                  >
                    <AnimatePresence>
                      {input.length > 0 && (
                        <motion.svg
                          xmlns='http://www.w3.org/2000/svg'
                          viewBox='0 0 16 16'
                          width={16}
                          height={16}
                          className='cursor-pointer transition-colors duration-200 text-graph_bg_thick hover:text-graph_weak'
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.2 }}
                        >
                          <path
                            d='M8 1.3333333333333333C4.318099999999999 1.3333333333333333 1.3333333333333333 4.318099999999999 1.3333333333333333 8C1.3333333333333333 11.681899999999999 4.318099999999999 14.666666666666666 8 14.666666666666666C11.681899999999999 14.666666666666666 14.666666666666666 11.681899999999999 14.666666666666666 8C14.666666666666666 4.318099999999999 11.681899999999999 1.3333333333333333 8 1.3333333333333333zM5.64258 6.3496C5.4473199999999995 6.1543399999999995 5.4473199999999995 5.837753333333333 5.64258 5.6424933333333325C5.837846666666666 5.447233333333333 6.154426666666667 5.447233333333333 6.349693333333333 5.6424933333333325L8 7.2928L9.650333333333332 5.6424933333333325C9.845566666666667 5.447233333333333 10.162166666666666 5.447233333333333 10.357433333333333 5.6424933333333325C10.552666666666667 5.837753333333333 10.552666666666667 6.1543399999999995 10.357433333333333 6.3496L8.7071 7.9999L10.357433333333333 9.650233333333333C10.552666666666667 9.845466666666667 10.552666666666667 10.162066666666666 10.357433333333333 10.357333333333333C10.162166666666666 10.5526 9.845566666666667 10.5526 9.650333333333332 10.357333333333333L8 8.706999999999999L6.349693333333333 10.357333333333333C6.154426666666667 10.5526 5.837846666666666 10.5526 5.64258 10.357333333333333C5.4473199999999995 10.162066666666666 5.4473199999999995 9.845466666666667 5.64258 9.650233333333333L7.2928999999999995 7.9999L5.64258 6.3496z'
                            fill='currentColor'
                          ></path>
                        </motion.svg>
                      )}
                    </AnimatePresence>
                  </span>
                  <i
                    className={
                      'text-[20px] text-text1 cursor-pointer transition-all duration-300 sic-BDC-magnifier_search_line'
                    }
                    onClick={() => setKw(input)}
                  ></i>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default SpaceFavoriteFilterWrapper
