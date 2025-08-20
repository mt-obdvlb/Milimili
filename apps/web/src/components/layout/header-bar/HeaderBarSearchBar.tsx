'use client'

import React, { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Command, CommandGroup, CommandItem } from '@/components/ui/command'
import { SearchLogTop10Result } from '@/types/search-log'
import Image from 'next/image'

const HeaderBarSearchBar = ({
  searchLogTop10List,
}: {
  searchLogTop10List?: SearchLogTop10Result
}) => {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  // 模拟搜索结果
  const results = ['鬼灭之刃', '进击的巨人', '柯南', '海贼王']

  // 点击或聚焦 input 时打开下拉
  const handleFocus = () => setOpen(true)

  // 点击其他地方关闭下拉
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!inputRef.current) return
      if (!(e.target instanceof Node)) return
      if (!inputRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  return (
    <div
      className={
        'max-w[500px] relative min-h-[38px] min-w-[181px] flex-1 ' + cn({ 'border-b-none': open })
      }
    >
      <form
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
            onFocus={handleFocus}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={'东方'}
            className={
              'focus-visible:border-input h-auto flex-1 rounded-none border-none bg-transparent py-0 pr-[8px] pl-0 text-[14px] leading-[20px] shadow-none ring-0 outline-none focus:border-none focus:shadow-none focus:ring-0 focus:outline-none focus-visible:ring-0'
            }
          />
        </div>
        <Button
          className={
            'absolute top-[3px] right-[7px] m-0 flex h-8 w-8 cursor-pointer items-center justify-center ' +
            'text-text1 rounded-[6px] border-0 bg-transparent p-0 leading-[32px] shadow-none transition-colors duration-300 hover:bg-[#E3E5E7]'
          }
          onClick={() => alert(`搜索: ${query}`)}
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
          {query.length === 0 && (
            <div className={'flex w-full flex-col items-center'}>
              <div className={'flex w-full items-center justify-between px-[16px]'}>
                <h2 className={'h-[24px] text-[16px] leading-[24px] font-medium'}>milimili热搜</h2>
              </div>
              <div className={'w-full'}>
                {searchLogTop10List?.map((item) => (
                  <Link
                    href={'/'}
                    key={item.keyword}
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
          )}
          {query.length > 0 && (
            <Command>
              <CommandGroup>
                {results.length ? (
                  results.map((r) => (
                    <CommandItem
                      key={r}
                      onSelect={() => {
                        setQuery(r)
                        setOpen(false)
                        inputRef.current?.focus()
                      }}
                    >
                      {r}
                    </CommandItem>
                  ))
                ) : (
                  <CommandItem disabled>无搜索结果</CommandItem>
                )}
              </CommandGroup>
            </Command>
          )}
        </div>
      )}
    </div>
  )
}

export default HeaderBarSearchBar
