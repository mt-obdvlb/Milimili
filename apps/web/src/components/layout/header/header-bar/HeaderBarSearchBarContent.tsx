import HeaderBarSearchBarHistory from '@/components/layout/header/header-bar/HeaderBarSearchBarHistory'
import Link from 'next/link'
import { cn } from '@/lib'
import Image from 'next/image'
import { Command, CommandItem, CommandList } from '@/components'
import React, { Dispatch, SetStateAction } from 'react'
import { SearchLogGetList, SearchLogTop10List } from '@mtobdvlb/shared-types'

const HeaderBarSearchBarContent = ({
  query,
  searchLogList,
  remove,
  setHistorys,
  historys,
  searchLogTop10List,
  handleSearch,
}: {
  query: string
  searchLogList?: SearchLogGetList
  historys: string[] | undefined
  setHistorys: Dispatch<SetStateAction<string[] | undefined>>
  remove: () => void
  searchLogTop10List?: SearchLogTop10List
  handleSearch: (kw: string) => Promise<void>
}) => {
  return (
    <>
      {(query.length === 0 || !searchLogList?.length) && (
        <>
          <HeaderBarSearchBarHistory
            historys={historys}
            setHistorys={setHistorys}
            remove={remove}
          />
          <div className={'flex w-full flex-col items-center'}>
            <div className={'flex w-full items-center justify-between px-[16px]'}>
              <h2 className={'h-[24px] text-[16px] leading-[24px] font-medium'}>milimili热搜</h2>
            </div>
            <div className={'w-full'}>
              {searchLogTop10List?.map((item) => (
                <Link
                  href={`/search?kw=${item.keyword}`}
                  key={item.keyword}
                  target={'_blank'}
                  onClick={(e) => {
                    e.preventDefault()
                    void handleSearch(item.keyword)
                  }}
                  className={
                    'flex h-[38px] items-center pl-[16px] hover:bg-[#E3E5E7] hover:outline-none'
                  }
                >
                  <p
                    className={cn(
                      'mr-[7px] h-[17px] w-[15px] min-w-[15px] text-center text-[14px] leading-[17px] text-[#18191C]',
                      item.rank > 3 && 'text-text3'
                    )}
                  >
                    {item.rank}
                  </p>
                  <p
                    className={
                      'mr-[6px] h-[17px] overflow-hidden text-sm leading-[17px] tracking-[0] text-ellipsis whitespace-nowrap'
                    }
                  >
                    {item.keyword}
                  </p>
                  {item.rank % 3 === 0 && (
                    <Image height={14} width={14} src={'/images/hot.png'} alt={'hot'} />
                  )}
                  {item.rank % 3 === 1 && (
                    <Image height={14} width={14} src={'/images/new.png'} alt={'new'} />
                  )}
                  {item.rank % 3 === 2 && (
                    <Image height={14} width={14} src={'/images/gen.png'} alt={'gen'} />
                  )}
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
      {query.length > 0 && searchLogList?.length && (
        <Command className={'size-full'}>
          <CommandList className={'mt-1.5 -mb-1.5'}>
            {searchLogList?.map((r, index) => (
              <CommandItem
                className={
                  'hover:bg-graph_bg_thick relative mb-1 block h-[32px] cursor-pointer overflow-hidden px-4 text-left text-sm leading-[32px] overflow-ellipsis whitespace-nowrap'
                }
                key={r.keyword + index}
                onSelect={() => handleSearch(r.keyword)}
              >
                {r.keyword}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      )}
    </>
  )
}

export default HeaderBarSearchBarContent
