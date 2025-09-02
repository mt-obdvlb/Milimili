'use client'

import React, { useEffect, useRef, useState } from 'react'
import { SearchLogTop10List } from '@mtobdvlb/shared-types'
import { useSearchLogGet } from '@/features'
import { useLocalStorage } from 'react-use'
import { Button, Input } from '@/components'
import HeaderBarSearchBarContent from '@/components/layout/header/header-bar/HeaderBarSearchBarContent'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib'

const SearchSearchBar = ({
  searchLogTop10List,
  className,
  kw = '',
}: {
  searchLogTop10List?: SearchLogTop10List
  className?: string
  kw?: string
}) => {
  const [query, setQuery] = useState(kw ?? '')
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLFormElement>(null)

  const { searchLogList } = useSearchLogGet(query)
  const [historys, setHistorys, remove] = useLocalStorage<string[]>('historys', [])
  const router = useRouter()

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
    inputRef.current?.focus()
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const handleSearch = async (keyword: string) => {
    if (!keyword) {
      inputRef.current?.focus()
      return
    }
    setHistorys([keyword, ...(historys?.filter((item) => item !== keyword) || [])])
    setQuery(keyword)
    router.push(`/search?kw=${keyword}`)
    inputRef.current?.blur()
  }

  return (
    <form
      className={cn(
        'bg-bg2 border-line_light focus-within:border-brand_blue relative mx-auto flex h-11 w-120 items-center justify-between rounded-[6px] border p-[5px] transition-all duration-200 focus-within:bg-white hover:bg-white',
        className
      )}
      ref={containerRef}
      onSubmit={async (e) => {
        e.preventDefault()
        await handleSearch(query)
      }}
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 24 24'
        width='24'
        height='24'
        className={'text-brand_blue mr-2.5 ml-[15px] w-5'}
      >
        <path
          d='M10.75 4.25C7.16015 4.25 4.25 7.16015 4.25 10.75C4.25 14.3399 7.16015 17.25 10.75 17.25C14.3399 17.25 17.25 14.3399 17.25 10.75C17.25 7.16015 14.3399 4.25 10.75 4.25zM2.25 10.75C2.25 6.05558 6.05558 2.25 10.75 2.25C15.4444 2.25 19.25 6.05558 19.25 10.75C19.25 15.4444 15.4444 19.25 10.75 19.25C6.05558 19.25 2.25 15.4444 2.25 10.75z'
          fill='currentColor'
        ></path>
        <path
          d='M15.7929 15.7929C16.1834 15.4024 16.8166 15.4024 17.2071 15.7929L20.4571 19.0429C20.8476 19.4334 20.8476 20.0666 20.4571 20.4571C20.0666 20.8476 19.4334 20.8476 19.0429 20.4571L15.7929 17.2071C15.4024 16.8166 15.4024 16.1834 15.7929 15.7929z'
          fill='currentColor'
        ></path>
      </svg>
      <Input
        ref={inputRef}
        placeholder={'输入关键字搜索'}
        className={
          'text-text1 placeholder:text-text2 mr-[15px] h-9 w-[calc(100%-160px)] border-none text-lg leading-4.5 placeholder:text-lg'
        }
        onFocus={handleFocus}
        onChange={(e) => setQuery(e.target.value)}
        value={query}
      />
      <Button
        type={'submit'}
        className={
          'bg-brand_blue border-brand_blue h-[34px] w-25 cursor-pointer rounded-[8px] border px-5 text-white'
        }
      >
        搜索
      </Button>
      {open && (
        <div
          className={
            'bg-bg1 border-line_regular absolute top-[46px] left-0 z-998 max-h-[612px] w-full overflow-y-auto rounded-[0_0_8px_8px] border border-t-0 pt-[13px] pb-4 shadow-[0_10px_30px_rgba(0,0,0,0.1)]'
          }
        >
          <HeaderBarSearchBarContent
            query={query}
            historys={historys}
            setHistorys={setHistorys}
            remove={remove}
            handleSearch={handleSearch}
            searchLogTop10List={searchLogTop10List}
            searchLogList={searchLogList}
          />
        </div>
      )}
    </form>
  )
}

export default SearchSearchBar
