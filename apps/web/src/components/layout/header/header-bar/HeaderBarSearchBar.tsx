'use client'

import React, { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { SearchLogTop10List } from '@mtobdvlb/shared-types'
import { useSearchLogGet } from '@/features'
import { openNewTab } from '@/utils'
import { useLocalStorage } from 'react-use'
import HeaderBarSearchBarContent from '@/components/layout/header/header-bar/HeaderBarSearchBarContent'

const HeaderBarSearchBar = ({
  searchLogTop10List,
  hidden,
}: {
  searchLogTop10List?: SearchLogTop10List
  hidden?: boolean
}) => {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const startedInsideRef = useRef(false)

  const { searchLogList } = useSearchLogGet(query)
  const [historys, setHistorys, remove] = useLocalStorage<string[]>('historys', [])

  const handleFocus = () => setOpen(true)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!containerRef.current) return
      if (!(e.target instanceof Node)) return
      if (!containerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const handleSearch = async (keyword: string) => {
    if (!keyword) keyword = searchLogList?.at(0)?.keyword ?? ''
    if (!keyword) return
    setHistorys([keyword, ...(historys?.filter((item) => item !== keyword) || [])])
    setQuery(keyword)
    openNewTab(`/search?kw=${keyword}`)
  }

  return (
    <div
      className={
        'max-w[500px] relative min-h-[38px] min-w-[181px] flex-1 ' + cn({ 'border-b-none': open })
      }
      hidden={hidden}
      ref={containerRef}
      onMouseDownCapture={() => {
        startedInsideRef.current = true
      }}
      onClickCapture={() => {
        startedInsideRef.current = false
      }}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault()
          void handleSearch(query)
        }}
        onFocus={handleFocus}
        className={cn(
          'relative z-1 flex h-[40px] items-center overflow-hidden rounded-[8px] border border-[#E3E5E7] bg-[#F1F2F3] pr-[48px] pl-[4px] text-[38px] text-[#18191C] opacity-90 transition-colors duration-300 hover:bg-white hover:opacity-100',
          {
            'rounded-b-none border-b-0 bg-white': open,
          }
        )}
      >
        <div
          className={
            'relative flex h-[32px] w-full items-center justify-between rounded-[6px] border-2 border-transparent px-[8px] leading-[38px] ' +
            cn({
              'bg-[#E3E5E7]': open,
            })
          }
        >
          <Input
            name={'keyword'}
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchLogList?.at(0)?.keyword}
            autoComplete='off'
            className={
              'text-text2 focus:text-text1 h-auto flex-1 rounded-none border-none bg-transparent py-0 pr-[8px] pl-0 text-[14px] leading-[20px] shadow-none ring-0 outline-none focus:border-none focus:shadow-none'
            }
          />
          {query.length > 0 && (
            <div className='group size-4 cursor-pointer' onClick={() => setQuery('')}>
              <svg
                width='16'
                height='16'
                viewBox='0 0 16 16'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
                className={'text-graph_weak absolute size-4'}
              >
                <path
                  className={'group-hover:fill-graph_icon'}
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M8 14.75C11.7279 14.75 14.75 11.7279 14.75 8C14.75 4.27208 11.7279 1.25 8 1.25C4.27208 1.25 1.25 4.27208 1.25 8C1.25 11.7279 4.27208 14.75 8 14.75ZM9.64999 5.64303C9.84525 5.44777 10.1618 5.44777 10.3571 5.64303C10.5524 5.83829 10.5524 6.15487 10.3571 6.35014L8.70718 8.00005L10.3571 9.64997C10.5524 9.84523 10.5524 10.1618 10.3571 10.3571C10.1618 10.5523 9.84525 10.5523 9.64999 10.3571L8.00007 8.70716L6.35016 10.3571C6.15489 10.5523 5.83831 10.5523 5.64305 10.3571C5.44779 10.1618 5.44779 9.84523 5.64305 9.64997L7.29296 8.00005L5.64305 6.35014C5.44779 6.15487 5.44779 5.83829 5.64305 5.64303C5.83831 5.44777 6.15489 5.44777 6.35016 5.64303L8.00007 7.29294L9.64999 5.64303Z'
                  fill='#C9CCD0'
                ></path>
              </svg>
            </div>
          )}
        </div>
        <Button
          type={'submit'}
          className={
            'absolute top-[3px] right-[7px] m-0 flex h-8 w-8 cursor-pointer items-center justify-center ' +
            'text-text1 rounded-[6px] border-0 bg-transparent p-0 leading-[32px] shadow-none transition-colors duration-300 hover:bg-[#E3E5E7]'
          }
        >
          <svg
            width='17'
            height='17'
            viewBox='0 0 17 17'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              fillRule='evenodd'
              clipRule='evenodd'
              d='M16.3451 15.2003C16.6377 15.4915 16.4752 15.772 16.1934 16.0632C16.15 16.1279 16.0958 16.1818 16.0525 16.2249C15.7707 16.473 15.4456 16.624 15.1854 16.3652L11.6848 12.8815C10.4709 13.8198 8.97529 14.3267 7.44714 14.3267C3.62134 14.3267 0.5 11.2314 0.5 7.41337C0.5 3.60616 3.6105 0.5 7.44714 0.5C11.2729 0.5 14.3943 3.59538 14.3943 7.41337C14.3943 8.98802 13.8524 10.5087 12.8661 11.7383L16.3451 15.2003ZM2.13647 7.4026C2.13647 10.3146 4.52083 12.6766 7.43624 12.6766C10.3517 12.6766 12.736 10.3146 12.736 7.4026C12.736 4.49058 10.3517 2.1286 7.43624 2.1286C4.50999 2.1286 2.13647 4.50136 2.13647 7.4026Z'
              fill='currentColor'
            ></path>
          </svg>
        </Button>
      </form>

      {open && (
        <div className='absolute top-full left-0 z-50 w-full overflow-y-auto rounded-b-[8px] border border-t-0 border-[#E3E5E7] bg-white p-0 pt-[13px] pb-[16px]'>
          <HeaderBarSearchBarContent
            query={query}
            searchLogList={searchLogList}
            historys={historys}
            setHistorys={setHistorys}
            remove={remove}
            handleSearch={handleSearch}
            searchLogTop10List={searchLogTop10List}
          />
        </div>
      )}
    </div>
  )
}

export default HeaderBarSearchBar
