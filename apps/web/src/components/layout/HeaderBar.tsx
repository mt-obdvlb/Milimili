'use client'

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import { Button } from '@/components/ui/button'
import { motion } from 'motion/react'
import React, { useEffect, useRef, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Command, CommandGroup, CommandItem } from '@/components/ui/command'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { cn } from '@/lib/utils'
import { useSearchLogGetTop10 } from '@/features/search-log/api'
import Link from 'next/link'
import { openNewTable } from '@/utils/openNewTable'

const headerBarLeftLinks = ['番剧', '直播', '游戏中心', '会员购', '赛事']

const HeaderBarLinkItemWithBounce = ({ link }: { link: string }) => {
  const [hovered, setHovered] = useState(false)
  const [animating, setAnimating] = useState(false)

  const handleMouseEnter = () => {
    if (animating) return
    setHovered(true)
    setAnimating(true)
  }

  return (
    <NavigationMenuItem key={link}>
      <NavigationMenuLink type='header-bar-first' href='/'>
        <motion.div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={() => {}}
          animate={hovered ? { y: [0, -5, 0] } : { y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          onAnimationComplete={() => {
            setHovered(false)
            setAnimating(false)
          }}
          className='relative flex items-center'
        >
          {link}
        </motion.div>
      </NavigationMenuLink>
    </NavigationMenuItem>
  )
}

const HeaderBarHoverCardWithBounce = ({
  title,
  Svg,
  hidden,
  children,
}: {
  title: string
  Svg: React.ReactNode
  hidden?: boolean
  children?: React.ReactNode
}) => {
  const [hovered, setHovered] = useState(false)
  const [animating, setAnimating] = useState(false)

  const handleMouseEnter = () => {
    if (animating) return
    setHovered(true)
    setAnimating(true)
  }

  return (
    <HoverCard openDelay={150} closeDelay={150}>
      <HoverCardTrigger asChild>
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={() => {}}
          className={'flex min-w-[50px] cursor-pointer flex-col items-center justify-center'}
        >
          <motion.div
            animate={hovered ? { y: [0, -5, 0] } : { y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            onAnimationComplete={() => {
              setHovered(false)
              setAnimating(false)
            }}
          >
            {Svg}
          </motion.div>
          <span className={'text-[13px]'}>{title}</span>
        </div>
      </HoverCardTrigger>
      <HoverCardContent sideOffset={20} hidden={hidden} autoFocus={false}>
        {children}
      </HoverCardContent>
    </HoverCard>
  )
}

const SearchBar = () => {
  const { searchLogTop10List } = useSearchLogGetTop10()
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
            'text-text-1 rounded-[6px] border-0 bg-transparent p-0 leading-[32px] shadow-none transition-colors duration-300 hover:bg-[#E3E5E7]'
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
                      className={
                        'mr-[7px] h-[17px] w-[15px] min-w-[15px] text-center text-[14px] leading-[17px] text-[#18191C]'
                      }
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

const HeaderBar = () => {
  return (
    <div className={'absolute top-0 left-0 z-1002 flex h-[64px] w-full items-center px-[24px]'}>
      <NavigationMenu className={'mr-[30px] shrink-0'}>
        <NavigationMenuList className={'h-[64px] gap-[0.25rem] whitespace-nowrap text-white'}>
          <NavigationMenuItem>
            <NavigationMenuLink type={'header-bar-first'} className={'items-center'} href='/'>
              <svg
                width='18'
                height='18'
                viewBox='0 0 18 18'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
                className={'mr-[6px] size-[18px] text-white'}
              >
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M3.73252 2.67094C3.33229 2.28484 3.33229 1.64373 3.73252 1.25764C4.11291 0.890684 4.71552 0.890684 5.09591 1.25764L7.21723 3.30403C7.27749 3.36218 7.32869 3.4261 7.37081 3.49407H10.5789C10.6211 3.4261 10.6723 3.36218 10.7325 3.30403L12.8538 1.25764C13.2342 0.890684 13.8368 0.890684 14.2172 1.25764C14.6175 1.64373 14.6175 2.28484 14.2172 2.67094L13.364 3.49407H14C16.2091 3.49407 18 5.28493 18 7.49407V12.9996C18 15.2087 16.2091 16.9996 14 16.9996H4C1.79086 16.9996 0 15.2087 0 12.9996V7.49406C0 5.28492 1.79086 3.49407 4 3.49407H4.58579L3.73252 2.67094ZM4 5.42343C2.89543 5.42343 2 6.31886 2 7.42343V13.0702C2 14.1748 2.89543 15.0702 4 15.0702H14C15.1046 15.0702 16 14.1748 16 13.0702V7.42343C16 6.31886 15.1046 5.42343 14 5.42343H4ZM5 9.31747C5 8.76519 5.44772 8.31747 6 8.31747C6.55228 8.31747 7 8.76519 7 9.31747V10.2115C7 10.7638 6.55228 11.2115 6 11.2115C5.44772 11.2115 5 10.7638 5 10.2115V9.31747ZM12 8.31747C11.4477 8.31747 11 8.76519 11 9.31747V10.2115C11 10.7638 11.4477 11.2115 12 11.2115C12.5523 11.2115 13 10.7638 13 10.2115V9.31747C13 8.76519 12.5523 8.31747 12 8.31747Z'
                  fill='currentColor'
                />
              </svg>
              <span>首页</span>
            </NavigationMenuLink>
          </NavigationMenuItem>
          {headerBarLeftLinks.map((link) => (
            <HeaderBarLinkItemWithBounce key={link} link={link} />
          ))}

          <NavigationMenuItem>
            <NavigationMenuLink type={'header-bar-first'} className={''} href='/'>
              <svg
                width='16'
                height='16'
                viewBox='0 0 16 16'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
                className={'mt-[-1px] mr-[5px] size-[16px] text-white'}
              >
                <path
                  d='M7.23181 8.65895V1.75796C7.23181 1.33935 7.57582 1 8.00018 1C8.42453 1 8.76854 1.33935 8.76854 1.75796V8.67097L9.98589 7.47009C10.286 7.17409 10.7725 7.17409 11.0725 7.47009C11.3726 7.7661 11.3726 8.24601 11.0725 8.54201L8.54958 11.0308C8.24952 11.3268 7.76302 11.3268 7.46295 11.0308L4.94002 8.54201C4.63995 8.24601 4.63995 7.7661 4.94002 7.47009C5.24008 7.17409 5.72658 7.17409 6.02665 7.47009L7.23181 8.65895Z'
                  fill='currentColor'
                ></path>
                <path
                  d='M3.48023 4.29936C2.40686 4.29936 1.53672 5.15772 1.53672 6.21656V11.5669C1.53672 12.6257 2.40686 13.4841 3.48023 13.4841H12.5198C13.5931 13.4841 14.4633 12.6257 14.4633 11.5669V6.21656C14.4633 5.15772 13.5931 4.29936 12.5198 4.29936H11.6158C11.1915 4.29936 10.8475 3.96001 10.8475 3.5414C10.8475 3.12279 11.1915 2.78344 11.6158 2.78344H12.5198C14.4418 2.78344 16 4.3205 16 6.21656V11.5669C16 13.4629 14.4418 15 12.5198 15H3.48023C1.55815 15 0 13.4629 0 11.5669V6.21656C0 4.3205 1.55815 2.78344 3.48023 2.78344H4.38418C4.80853 2.78344 5.15254 3.12279 5.15254 3.5414C5.15254 3.96001 4.80853 4.29936 4.38418 4.29936H3.48023Z'
                  fill='currentColor'
                ></path>
              </svg>
              <span>下载客户端</span>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <SearchBar />
      <div className={'ml-[10px] flex items-center text-white'}>
        <HeaderBarHoverCardWithBounce
          title={'大会员'}
          Svg={
            <svg
              width='20'
              height='20'
              viewBox='0 0 20 20'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M10 1C5.02955 1 1 5.02955 1 10C1 14.9705 5.02955 19 10 19C14.9705 19 19 14.9705 19 10C19 5.02955 14.9705 1 10 1ZM10.0006 2.63614C14.0612 2.63614 17.3642 5.93996 17.3642 9.99977C17.3642 14.0604 14.0612 17.3634 10.0006 17.3634C5.93996 17.3634 2.63696 14.0604 2.63696 9.99977C2.63696 5.93996 5.93996 2.63614 10.0006 2.63614Z'
                fill='currentColor'
              ></path>
              <path
                d='M13.1381 8.05573V8.05331H10.7706C10.7859 7.8643 10.7948 7.67286 10.7948 7.47981C10.7948 7.26414 10.7843 7.05008 10.7649 6.83926C10.7658 6.82552 10.7674 6.81179 10.7674 6.79725V6.79483C10.7674 6.35541 10.4111 6 9.97254 6C9.53312 6 9.17771 6.35622 9.17771 6.79483V6.79725C9.17771 6.85137 9.18336 6.90468 9.19386 6.95557L9.18255 6.95719C9.19871 7.12924 9.20759 7.30291 9.20759 7.479C9.20759 7.67286 9.19709 7.8643 9.17771 8.0525H6.74313V8.05573C6.32876 8.08239 6 8.42649 6 8.84814V8.85057C6 9.28998 6.33683 9.64216 6.77544 9.64216C6.80937 9.64216 6.8441 9.64378 6.89903 9.64297L8.7601 9.63893C8.28837 10.7294 7.47011 11.6341 6.44507 12.2149C6.44023 12.2173 6.43619 12.2197 6.43134 12.2229C6.42003 12.2294 6.40953 12.2359 6.39822 12.2423L6.39903 12.2431C6.17528 12.3837 6.02585 12.6325 6.02585 12.916V12.9184C6.02585 13.3578 6.38207 13.7132 6.82068 13.7132C6.99111 13.7132 7.14782 13.6591 7.27706 13.5687C8.7706 12.706 9.9168 11.3094 10.4556 9.64055H13.0105C13.0517 9.64136 13.1131 9.63893 13.1131 9.63893C13.5905 9.62924 13.9039 9.2916 13.9039 8.85299V8.85057C13.9047 8.42003 13.5638 8.07108 13.1381 8.05573Z'
                fill='currentColor'
              ></path>
              <path
                d='M13.7731 12.5388C13.7715 12.5356 13.7691 12.5331 13.7674 12.5307C13.74 12.4814 13.7077 12.4362 13.6713 12.3942C13.1584 11.6672 12.513 11.0412 11.7674 10.5541L11.7666 10.555C11.6366 10.4613 11.4766 10.4055 11.3046 10.4055C10.8652 10.4055 10.5098 10.7617 10.5098 11.2003V11.2028C10.5098 11.5033 10.677 11.765 10.9233 11.8999C11.5615 12.3215 12.0825 12.8045 12.4944 13.4499L12.5372 13.5041C12.6786 13.6333 12.866 13.7133 13.0728 13.7133C13.5122 13.7133 13.8676 13.3571 13.8676 12.9184V12.916C13.8668 12.7795 13.8329 12.6511 13.7731 12.5388Z'
                fill='currentColor'
              ></path>
            </svg>
          }
        ></HeaderBarHoverCardWithBounce>
        <HeaderBarHoverCardWithBounce
          title={'消息'}
          Svg={
            <svg
              width='20'
              height='20'
              viewBox='0 0 20 20'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
              className='right-entry-icon'
            >
              <path
                d='M15.435 17.7717H4.567C2.60143 17.7717 1 16.1723 1 14.2047V5.76702C1 3.80144 2.59942 2.20001 4.567 2.20001H15.433C17.3986 2.20001 19 3.79943 19 5.76702V14.2047C19.002 16.1703 17.4006 17.7717 15.435 17.7717ZM4.567 4.00062C3.59327 4.00062 2.8006 4.79328 2.8006 5.76702V14.2047C2.8006 15.1784 3.59327 15.9711 4.567 15.9711H15.433C16.4067 15.9711 17.1994 15.1784 17.1994 14.2047V5.76702C17.1994 4.79328 16.4067 4.00062 15.433 4.00062H4.567Z'
                fill='currentColor'
              ></path>
              <path
                d='M9.99943 11.2C9.51188 11.2 9.02238 11.0667 8.59748 10.8019L8.5407 10.7635L4.3329 7.65675C3.95304 7.37731 3.88842 6.86226 4.18996 6.50976C4.48954 6.15544 5.0417 6.09699 5.4196 6.37643L9.59412 9.45943C9.84279 9.60189 10.1561 9.60189 10.4067 9.45943L14.5812 6.37643C14.9591 6.09699 15.5113 6.15544 15.8109 6.50976C16.1104 6.86409 16.0478 7.37731 15.6679 7.65675L11.4014 10.8019C10.9765 11.0667 10.487 11.2 9.99943 11.2Z'
                fill='currentColor'
              ></path>
            </svg>
          }
        ></HeaderBarHoverCardWithBounce>
        <HeaderBarHoverCardWithBounce
          title={'动态'}
          Svg={
            <svg
              width='20'
              height='21'
              viewBox='0 0 20 21'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
              className='right-entry-icon'
            >
              <g clipPath='url(#clip0)'>
                <path
                  d='M10 10.743C7.69883 10.743 5.83333 8.87747 5.83333 6.5763C5.83333 4.27512 7.69883 2.40964 10 2.40964V10.743Z'
                  stroke='currentColor'
                  strokeWidth='1.6'
                  strokeLinejoin='round'
                ></path>
                <path
                  d='M10 10.743C10 13.0441 8.1345 14.9096 5.83333 14.9096C3.53217 14.9096 1.66667 13.0441 1.66667 10.743H10Z'
                  stroke='currentColor'
                  strokeWidth='1.6'
                  strokeLinejoin='round'
                ></path>
                <path
                  d='M10 10.743C10 8.44182 11.8655 6.57632 14.1667 6.57632C16.4679 6.57632 18.3333 8.44182 18.3333 10.743H10Z'
                  stroke='currentColor'
                  strokeWidth='1.6'
                  strokeLinejoin='round'
                ></path>
                <path
                  d='M9.99999 10.743C12.3012 10.743 14.1667 12.6085 14.1667 14.9096C14.1667 17.2108 12.3012 19.0763 9.99999 19.0763V10.743Z'
                  stroke='currentColor'
                  strokeWidth='1.6'
                  strokeLinejoin='round'
                ></path>
              </g>
              <defs>
                <clipPath id='clip0'>
                  <rect
                    width='20'
                    height='20'
                    fill='currentColor'
                    transform='matrix(-1 0 0 1 20 0.742981)'
                  ></rect>
                </clipPath>
              </defs>
            </svg>
          }
        ></HeaderBarHoverCardWithBounce>
        <HeaderBarHoverCardWithBounce
          title={'收藏'}
          Svg={
            <svg
              width='20'
              height='21'
              viewBox='0 0 20 21'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
              className='right-entry-icon'
            >
              <path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M11.0505 3.16759L12.7915 6.69573C12.954 7.02647 13.2702 7.25612 13.6349 7.30949L17.5294 7.87474C18.448 8.00817 18.8159 9.13785 18.1504 9.78639L15.3331 12.5334C15.0686 12.7905 14.9481 13.1609 15.0104 13.5256L15.6759 17.4031C15.8328 18.3184 14.8721 19.0171 14.0497 18.5845L10.5661 16.7537C10.2402 16.5823 9.85042 16.5823 9.52373 16.7537L6.04087 18.5845C5.21848 19.0171 4.2578 18.3184 4.41468 17.4031L5.07939 13.5256C5.14166 13.1609 5.02198 12.7905 4.75755 12.5334L1.9394 9.78639C1.27469 9.13785 1.64182 8.00817 2.56126 7.87474L6.4549 7.30949C6.82041 7.25612 7.13578 7.02647 7.29832 6.69573L9.04015 3.16759C9.45095 2.33468 10.6389 2.33468 11.0505 3.16759Z'
                stroke='currentColor'
                strokeWidth='1.6'
                strokeLinecap='round'
                strokeLinejoin='round'
              ></path>
              <path
                d='M11.603 11.8739C11.413 12.5556 10.7871 13.0554 10.0447 13.0554C9.29592 13.0554 8.66679 12.5467 8.48242 11.8569'
                stroke='currentColor'
                strokeWidth='1.6'
                strokeLinecap='round'
                strokeLinejoin='round'
              ></path>
            </svg>
          }
        ></HeaderBarHoverCardWithBounce>
        <HeaderBarHoverCardWithBounce
          title={'历史'}
          Svg={
            <svg
              width='20'
              height='21'
              viewBox='0 0 20 21'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
              className='right-entry-icon'
            >
              <path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M10 1.74286C5.02955 1.74286 1 5.7724 1 10.7429C1 15.7133 5.02955 19.7429 10 19.7429C14.9705 19.7429 19 15.7133 19 10.7429C19 5.7724 14.9705 1.74286 10 1.74286ZM10.0006 3.379C14.0612 3.379 17.3642 6.68282 17.3642 10.7426C17.3642 14.8033 14.0612 18.1063 10.0006 18.1063C5.93996 18.1063 2.63696 14.8033 2.63696 10.7426C2.63696 6.68282 5.93996 3.379 10.0006 3.379Z'
                fill='currentColor'
              ></path>
              <path
                d='M9.99985 6.6521V10.743'
                stroke='currentColor'
                strokeWidth='1.7'
                strokeLinecap='round'
              ></path>
              <path
                d='M12.4545 10.7427H10'
                stroke='currentColor'
                strokeWidth='1.7'
                strokeLinecap='round'
              ></path>
            </svg>
          }
        ></HeaderBarHoverCardWithBounce>

        <HeaderBarHoverCardWithBounce
          hidden
          title={'创作中心'}
          Svg={
            <svg
              width='20'
              height='21'
              viewBox='0 0 20 21'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
              className='right-entry-icon'
            >
              <mask
                id='mask0'
                mask-type='alpha'
                maskUnits='userSpaceOnUse'
                x='2'
                y='1'
                width='16'
                height='20'
              >
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M2.5 1.74286H17.5V20.0762H2.5V1.74286Z'
                  fill='currentColor'
                ></path>
              </mask>
              <g mask='url(#mask0)'>
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M9.99999 1.74286C9.92916 1.74286 9.85916 1.74369 9.78833 1.74536C5.85416 1.85453 2.58416 5.14869 2.50166 9.08286C2.44999 11.5404 3.58666 13.7304 5.36999 15.1337C5.52166 15.2529 5.63166 15.4162 5.67333 15.6045L6.30416 18.447C6.51583 19.3987 7.36083 20.0762 8.33583 20.0762H11.6617C12.6383 20.0762 13.4842 19.3987 13.6958 18.4445L14.3275 15.602C14.3692 15.4154 14.4775 15.2537 14.6275 15.1354C16.3733 13.7629 17.5 11.637 17.5 9.24286C17.5 5.10036 14.1425 1.74286 9.99999 1.74286ZM10.0003 3.40939C13.2161 3.40939 15.8336 6.02606 15.8336 9.24273C15.8336 11.0386 15.0186 12.7086 13.5978 13.8252C13.1428 14.1827 12.8244 14.6852 12.7011 15.2402L12.0686 18.0827C12.0269 18.2752 11.8586 18.4094 11.6619 18.4094H8.33609C8.14109 18.4094 7.97359 18.2761 7.93192 18.0852L7.30025 15.2427C7.17609 14.6869 6.85775 14.1827 6.40109 13.8236C4.94359 12.6769 4.12942 10.9619 4.16859 9.11773C4.23192 6.05523 6.77442 3.49606 9.83442 3.41189C9.88942 3.41023 9.94525 3.40939 10.0003 3.40939Z'
                  fill='currentColor'
                ></path>
                <path
                  d='M10 6.81299L8.81253 9.18726H11.1875L9.99952 11.561'
                  stroke='currentColor'
                  strokeWidth='1.6'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                ></path>
              </g>
              <path d='M6.66656 15.9095H13.3332' stroke='currentColor' strokeWidth='1.7'></path>
            </svg>
          }
        ></HeaderBarHoverCardWithBounce>
        <HoverCard openDelay={150} closeDelay={150}>
          <HoverCardTrigger onClick={() => openNewTable('/')} asChild>
            <div
              className={
                'ml-[10px] flex h-[34px] w-[90px] min-w-[50px] cursor-pointer items-center justify-center rounded-[8px] bg-[#fb7299] transition-colors duration-300 hover:bg-[#fc8bab]'
              }
            >
              <svg
                width='18'
                height='18'
                viewBox='0 0 18 18'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
                className='mr-[5px]'
              >
                <path
                  d='M12.0824 10H14.1412C15.0508 10 15.7882 10.7374 15.7882 11.6471V12.8824C15.7882 13.792 15.0508 14.5294 14.1412 14.5294H3.84707C2.93743 14.5294 2.20001 13.792 2.20001 12.8824V11.6471C2.20001 10.7374 2.93743 10 3.84707 10H5.90589'
                  stroke='currentColor'
                  strokeWidth='1.7'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                ></path>
                <path
                  d='M8.99413 11.2353L8.99413 3.82353'
                  stroke='currentColor'
                  strokeWidth='1.7'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                ></path>
                <path
                  d='M12.0823 6.29413L8.9941 3.20589L5.90587 6.29413'
                  stroke='currentColor'
                  strokeWidth='1.7'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                ></path>
              </svg>
              <span className={'text-[14px] font-black'}>投稿</span>
            </div>
          </HoverCardTrigger>
          <HoverCardContent
            align={'end'}
            sideOffset={20}
            className='flex w-[150px] bg-white px-[10px] py-[8px] text-[#18191C]'
          >
            {[
              {
                title: '视频投稿',
                href: '/',
                svg: (
                  <svg
                    width='26'
                    height='26'
                    viewBox='0 0 26 26'
                    fill='currentColor'
                    xmlns='http://www.w3.org/2000/svg'
                    className='mb-[6px] size-[26px] overflow-hidden text-[#61666D]'
                  >
                    <rect opacity='0.01' x='1.55603' width='24' height='24' fill='#C4C4C4'></rect>
                    <path
                      fillRule='evenodd'
                      clipRule='evenodd'
                      d='M21.556 10.1866C21.0037 10.1866 20.556 10.6343 20.556 11.1866V12.5712C20.556 13.1234 21.0037 13.5712 21.556 13.5712C22.1083 13.5712 22.556 13.1234 22.556 12.5712V11.1866C22.556 10.6343 22.1083 10.1866 21.556 10.1866ZM14.556 20.5C14.0037 20.5 13.556 20.9477 13.556 21.5C13.556 22.0523 14.0037 22.5 14.556 22.5H15.556C16.1083 22.5 16.556 22.0523 16.556 21.5C16.556 20.9477 16.1083 20.5 15.556 20.5H14.556Z'
                      fill='var(--text2)'
                    ></path>
                    <path
                      fillRule='evenodd'
                      clipRule='evenodd'
                      d='M22.6093 15.348C22.0235 14.7622 21.0738 14.7622 20.488 15.348L18.0131 17.8229C17.6226 18.2134 17.6226 18.8465 18.0131 19.2371C18.4037 19.6276 19.0368 19.6276 19.4274 19.2371L21.5487 17.1158L23.67 19.2371C24.0605 19.6276 24.6937 19.6276 25.0842 19.2371C25.4747 18.8465 25.4747 18.2134 25.0842 17.8229L22.6093 15.348Z'
                      fill='var(--text2)'
                    ></path>
                    <path
                      fillRule='evenodd'
                      clipRule='evenodd'
                      d='M21.5487 14.9759C22.101 14.9759 22.5487 15.4236 22.5487 15.9759L22.5487 22.5C22.5487 23.0523 22.101 23.5 21.5487 23.5C20.9964 23.5 20.5487 23.0523 20.5487 22.5L20.5487 15.9759C20.5487 15.4236 20.9964 14.9759 21.5487 14.9759Z'
                      fill='var(--text2)'
                    ></path>
                    <path
                      fillRule='evenodd'
                      clipRule='evenodd'
                      d='M3.20868 5.5H19.556C20.1083 5.5 20.556 5.94771 20.556 6.5V11.8911H22.556V6.5C22.556 4.84315 21.2129 3.5 19.556 3.5H3.20868C1.55183 3.5 0.208679 4.84315 0.208679 6.5V19.5C0.208679 21.1569 1.55182 22.5 3.20868 22.5H15.453V20.5H3.20868C2.65639 20.5 2.20868 20.0523 2.20868 19.5V6.5C2.20868 5.94772 2.6564 5.5 3.20868 5.5Z'
                      fill='var(--text2)'
                    ></path>
                    <path
                      d='M13.3617 12.134C14.0284 12.5189 14.0284 13.4811 13.3617 13.866L10.3617 15.5981C9.69503 15.983 8.86169 15.5019 8.86169 14.7321V11.2679C8.86169 10.4981 9.69503 10.017 10.3617 10.4019L13.3617 12.134Z'
                      fill='var(--text2)'
                    ></path>
                  </svg>
                ),
              },
              {
                title: '投稿管理',
                href: '/',
                svg: (
                  <svg
                    width='26'
                    height='26'
                    viewBox='0 0 26 26'
                    fill='currentColor'
                    xmlns='http://www.w3.org/2000/svg'
                    className='mb-[6px] size-[26px] overflow-hidden text-[#61666D]'
                  >
                    <rect opacity='0.01' x='1.5' y='1' width='24' height='24' fill='#C4C4C4'></rect>
                    <path
                      fillRule='evenodd'
                      clipRule='evenodd'
                      d='M16 3.5H6C5.72386 3.5 5.5 3.72386 5.5 4V21C5.5 21.2761 5.72386 21.5 6 21.5H10.5H11.5C12.0523 21.5 12.5 21.9477 12.5 22.5C12.5 23.0523 12.0523 23.5 11.5 23.5H10.5H6C4.61929 23.5 3.5 22.3807 3.5 21V4C3.5 2.61929 4.61929 1.5 6 1.5H16C19.5899 1.5 22.5 4.41015 22.5 8V11.2806V11.818V12.2806C22.5 12.8329 22.0523 13.2806 21.5 13.2806C20.9477 13.2806 20.5 12.8329 20.5 12.2806V11.818V11.2806V8C20.5 5.51472 18.4853 3.5 16 3.5ZM15 10.634C15.6667 11.0189 15.6667 11.9811 15 12.366L12 14.0981C11.3333 14.483 10.5 14.0019 10.5 13.2321V9.76795C10.5 8.99815 11.3333 8.51702 12 8.90192L15 10.634ZM23.9227 20.238C24.2799 19.6192 24.2799 18.8568 23.9227 18.238L22.3274 15.4748C21.9701 14.856 21.3098 14.4748 20.5953 14.4748H17.4047C16.6902 14.4748 16.0299 14.856 15.6727 15.4748L14.0774 18.238C13.7201 18.8568 13.7201 19.6192 14.0774 20.238L15.6727 23.0011C16.0299 23.6199 16.6902 24.0011 17.4047 24.0011H20.5953C21.3098 24.0011 21.9701 23.6199 22.3274 23.0011L23.9227 20.238ZM17.2604 16.7248C17.3497 16.5701 17.5148 16.4748 17.6934 16.4748H20.3066C20.4853 16.4748 20.6503 16.5701 20.7397 16.7248L22.0463 18.988C22.1356 19.1427 22.1356 19.3333 22.0463 19.488L20.7397 21.7511C20.6503 21.9058 20.4853 22.0011 20.3066 22.0011H17.6934C17.5148 22.0011 17.3497 21.9058 17.2604 21.7511L15.9538 19.488C15.8644 19.3333 15.8644 19.1427 15.9538 18.988L17.2604 16.7248ZM19 17.9879C18.3096 17.9879 17.75 18.5476 17.75 19.2379C17.75 19.9283 18.3096 20.4879 19 20.4879C19.6904 20.4879 20.25 19.9283 20.25 19.2379C20.25 18.5476 19.6904 17.9879 19 17.9879Z'
                      fill='var(--text2)'
                    ></path>
                  </svg>
                ),
              },
            ].map((item) => (
              <Link
                href={item.href}
                key={item.title}
                className={
                  'flex h-[63px] w-[62px] cursor-pointer flex-col items-center justify-center rounded-[8px] text-center leading-[63px] no-underline transition-colors duration-300 hover:bg-[#E3E5E7]'
                }
              >
                {item.svg}
                <span className={'text-text-2 text-xs leading-[17px]'}>{item.title}</span>
              </Link>
            ))}
          </HoverCardContent>
        </HoverCard>
      </div>
    </div>
  )
}

export default HeaderBar
