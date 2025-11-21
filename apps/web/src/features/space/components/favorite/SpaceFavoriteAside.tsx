'use client'

import { useFavoriteGetFolderList } from '@/features'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useUserStore } from '@/stores'
import { useEffect, useState } from 'react'
import { Collapsible, CollapsibleTrigger } from '@/components/ui/collapsible'
import { cn } from '@/lib'
import { Button } from '@/components'
import FavoriteAddModel from '@/components/layout/models/favorite-add-model/FavoriteAddModel'
import { AnimatePresence, motion } from 'motion/react'
import SpaceFavoriteHoverCard from '@/features/space/components/favorite/SpaceFavoriteHoverCard'

const SpaceFavoriteAside = ({ userId }: { userId: string }) => {
  const { favoriteFolderList } = useFavoriteGetFolderList(userId)
  const user = useUserStore((state) => state.user)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [open, setOpen] = useState(true)

  const folderId = searchParams.get('folderId')

  useEffect(() => {
    if (!favoriteFolderList) return
    if (!folderId) {
      const defaultFolder = favoriteFolderList.find((f) => f.type === 'default')
      if (defaultFolder) {
        router.replace(`${pathname}?folderId=${defaultFolder.id}`)
      }
    }
  }, [favoriteFolderList, folderId, pathname, router])

  if (!favoriteFolderList) return null

  return (
    <div>
      <Collapsible
        open={open}
        onOpenChange={(open) => setOpen(open)}
        className={
          'transition duration-300 border-b border-b-line_regular text-[16px] leading-[1.5] text-text1'
        }
      >
        <CollapsibleTrigger
          className={
            'leading-12 w-full hover:text-brand_blue font-medium text-[16px] px-4 h-12 flex items-center justify-between cursor-pointer'
          }
        >
          {user?.id === userId ? '我' : 'TA'}创建的文件夹
          <div className={cn('transition duration-300', open ? 'rotate-90' : 'rotate-270')}>
            <svg
              className='vui_icon'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 14 14'
              width='14'
              height='14'
              clip={'size-3.5'}
            >
              <path
                d='M5.086474166666667 1.8781408333333334C4.9156216666666674 2.048999166666667 4.9156216666666674 2.3260066666666668 5.086474166666667 2.496859166666667L9.383383333333333 6.793762500000001C9.497279166666667 6.9076875 9.497279166666667 7.092312500000001 9.383383333333333 7.2062375L5.086474166666667 11.503129166666668C4.9156216666666674 11.6739875 4.9156216666666674 11.951012500000001 5.086474166666667 12.121870833333332C5.2573325 12.2927 5.534345833333334 12.2927 5.7051983333333345 12.121870833333332L10.002095833333335 7.82495C10.457708333333333 7.369337500000001 10.457708333333333 6.6306625 10.002095833333335 6.175050000000001L5.7051983333333345 1.8781408333333334C5.534345833333334 1.7072883333333333 5.2573325 1.7072883333333333 5.086474166666667 1.8781408333333334z'
                fill='currentColor'
              ></path>
            </svg>
          </div>
        </CollapsibleTrigger>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key='collapsible-content'
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              transition={{
                duration: 0.3,
                ease: 'easeOut',
              }}
              className={'pb-4 overflow-hidden'}
            >
              <div className={'max-h-[458px] overflow-y-auto overflow-x-hidden'}>
                <FavoriteAddModel>
                  <Button
                    className={
                      'flex items-center w-full h-12 group rounded-[6px] py-3.5 px-4 cursor-pointer transition-all duration-300 ease-out text-sm'
                    }
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 20 20'
                      width='20'
                      height='20'
                      className={'mr-2 text-brand_blue size-5'}
                    >
                      <path
                        d='M11.25 3.75C11.25 3.404825 11.529833333333334 3.125 11.875 3.125L16.041666666666668 3.125C16.386833333333335 3.125 16.666666666666668 3.404825 16.666666666666668 3.75C16.666666666666668 4.095175 16.386833333333335 4.375 16.041666666666668 4.375L11.875 4.375C11.529833333333334 4.375 11.25 4.095175 11.25 3.75z'
                        fill='currentColor'
                      ></path>
                      <path
                        d='M9.050375 3.925716666666667C8.515666666666666 3.284041666666667 7.709475 2.918125 6.8652 2.95975C6.03485 3.0006833333333334 5.41075 3.0499833333333335 4.725341666666667 3.1168250000000004C3.2153416666666668 3.2640583333333333 1.98605 4.4355 1.8496333333333335 5.975008333333334C1.7543333333333333 7.050541666666667 1.6666666666666667 8.457833333333333 1.6666666666666667 9.997833333333334C1.6666666666666667 11.566791666666667 1.75765 12.998000000000001 1.8550250000000001 14.081041666666668C1.9902583333333335 15.585291666666667 3.1767166666666666 16.74395833333333 4.674708333333334 16.865458333333333C5.9936 16.972416666666668 7.860483333333334 17.081166666666668 10 17.081166666666668C12.213208333333332 17.081166666666668 14.134708333333332 16.964791666666667 15.459708333333333 16.854375C16.87316666666667 16.736666666666668 18.040583333333334 15.681416666666665 18.192625000000003 14.232291666666667C18.27025 13.492 18.333333333333336 12.57525 18.333333333333336 11.549333333333333C18.333333333333336 10.440666666666667 18.259666666666668 9.285375 18.174541666666666 8.318808333333335C18.02629166666667 6.6359666666666675 16.597416666666668 5.41655 14.944916666666668 5.41655L10.780166666666666 5.41655C10.471208333333333 5.41655 10.178416666666667 5.2793833333333335 9.980375 5.041741666666667L9.050375 3.925716666666667zM9.444291666666667 8.750041666666666C9.444291666666667 8.443191666666667 9.693041666666668 8.194483333333334 9.999875000000001 8.194483333333334C10.306666666666667 8.194483333333334 10.555416666666666 8.443191666666667 10.555416666666666 8.750041666666666L10.555416666666666 10.486125L12.291541666666667 10.486125C12.598333333333334 10.486125 12.847083333333334 10.734875 12.847083333333334 11.041708333333334C12.847083333333334 11.3485 12.598333333333334 11.59725 12.291541666666667 11.59725L10.555416666666666 11.59725L10.555416666666666 13.333375000000002C10.555416666666666 13.64016666666667 10.306666666666667 13.888916666666667 9.999875000000001 13.888916666666667C9.693041666666668 13.888916666666667 9.444291666666667 13.64016666666667 9.444291666666667 13.333375000000002L9.444291666666667 11.59725L7.708200000000001 11.59725C7.401375000000001 11.59725 7.152641666666668 11.3485 7.152641666666668 11.041708333333334C7.152641666666668 10.734875 7.401375000000001 10.486125 7.708200000000001 10.486125L9.444291666666667 10.486125L9.444291666666667 8.750041666666666z'
                        fill='currentColor'
                      ></path>
                    </svg>
                    <span className={'group-hover:text-brand_blue transition-colors duration-300'}>
                      新建文件夹
                    </span>
                  </Button>
                </FavoriteAddModel>
                <div className={'flex flex-col'}>
                  {favoriteFolderList.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => router.push(`/space/${userId}/favorite?folderId=${item.id}`)}
                      className={cn(
                        'h-12 text-text1 transition-all group duration-200 flex items-center justify-between py-3.5 px-4 rounded-[6px] cursor-pointer',
                        item.id === folderId
                          ? 'bg-brand_blue text-white'
                          : 'hover:bg-graph_bg_thick'
                      )}
                    >
                      <div className={cn('w-full relative  flex items-center justify-between')}>
                        <div className={'relative w-full flex items-center'}>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            viewBox='0 0 20 20'
                            width='20'
                            height='20'
                            className={cn(
                              'text-text3 mr-2 size-5',
                              item.id === folderId && 'text-white'
                            )}
                          >
                            <path
                              d='M11.25 3.75C11.25 3.404825 11.529833333333334 3.125 11.875 3.125L16.041666666666668 3.125C16.386833333333335 3.125 16.666666666666668 3.404825 16.666666666666668 3.75C16.666666666666668 4.095175 16.386833333333335 4.375 16.041666666666668 4.375L11.875 4.375C11.529833333333334 4.375 11.25 4.095175 11.25 3.75z'
                              fill='currentColor'
                            ></path>
                            <path
                              d='M6.8652 2.9599583333333337C7.709475 2.9183333333333334 8.515666666666666 3.28425 9.050375 3.925925L9.980375 5.041950000000001C10.178416666666667 5.279583333333333 10.471208333333333 5.41675 10.780166666666666 5.41675L14.944916666666668 5.41675C16.597416666666668 5.41675 18.02629166666667 6.636175 18.174541666666666 8.318991666666667C18.259666666666668 9.285541666666667 18.333333333333336 10.440875 18.333333333333336 11.549583333333334C18.333333333333336 12.575458333333334 18.27025 13.492166666666668 18.192625000000003 14.232500000000002C18.040583333333334 15.681625 16.87316666666667 16.736833333333333 15.459708333333333 16.854625C14.134708333333332 16.965 12.213208333333332 17.081416666666666 10 17.081416666666666C7.860483333333334 17.081416666666666 5.9936 16.972583333333336 4.674708333333334 16.86566666666667C3.1767166666666666 16.74416666666667 1.9902583333333335 15.585500000000001 1.8550250000000001 14.08125C1.75765 12.998166666666666 1.6666666666666667 11.567 1.6666666666666667 9.998083333333334C1.6666666666666667 8.458 1.7543333333333333 7.050750000000001 1.8496333333333335 5.975208333333334C1.98605 4.435700000000001 3.2153416666666668 3.264266666666667 4.725341666666667 3.117025C5.41075 3.0501916666666666 6.03485 3.000891666666667 6.8652 2.9599583333333337zM8.090091666666666 4.7261500000000005C7.800241666666667 4.378325 7.368958333333334 4.1866416666666675 6.926749999999999 4.208433333333334C6.11845 4.248283333333334 5.5143916666666675 4.296016666666667 4.84665 4.361125C3.9067416666666666 4.452775 3.1756 5.173141666666667 3.0947583333333335 6.0855500000000005C3.0018249999999997 7.1343 2.916666666666667 8.503625 2.916666666666667 9.998083333333334C2.916666666666667 11.520625 3.0050583333333334 12.913250000000001 3.1 13.969333333333335C3.1800916666666668 14.860166666666668 3.876841666666667 15.546875 4.775741666666667 15.619750000000002C6.069166666666667 15.724625000000001 7.901483333333334 15.831416666666666 10 15.831416666666666C12.170875 15.831416666666666 14.056791666666667 15.717125000000001 15.355958333333335 15.608916666666666C16.21004166666667 15.537749999999999 16.864083333333333 14.915958333333332 16.949458333333332 14.102083333333333C17.023333333333333 13.397666666666668 17.083333333333336 12.525 17.083333333333336 11.549583333333334C17.083333333333336 10.491041666666668 17.012708333333336 9.375291666666666 16.929333333333336 8.428708333333333C16.841166666666666 7.427583333333334 15.98675 6.66675 14.944916666666668 6.66675L10.780166666666666 6.66675C10.099833333333333 6.66675 9.455416666666668 6.364508333333333 9.020125 5.842175L8.090091666666666 4.7261500000000005z'
                              fill='currentColor'
                            ></path>
                          </svg>
                          <span className={'line-clamp-1 max-w-[145px] text-sm text-ellipsis'}>
                            {item.name}
                          </span>
                        </div>
                        {user?.id === userId && (
                          <SpaceFavoriteHoverCard item={item} folderId={folderId} />
                        )}
                        <div
                          className={cn(
                            'shrink-0 text-xs text-text3',
                            item.id === folderId && 'text-white',
                            user?.id === userId &&
                              'group-hover:hidden peer-data-[state=open]:hidden'
                          )}
                        >
                          {item.number}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Collapsible>
      {user?.id === userId && (
        <div className='transition duration-300 border-b border-b-line_regular text-[16px] leading-[1.5] text-text1'>
          <Link
            target={'_blank'}
            className='font-medium hover:text-brand_blue px-4 h-12 flex items-center  cursor-pointer'
            href='/watch-later'
          >
            稍后再看
          </Link>
        </div>
      )}
    </div>
  )
}

export default SpaceFavoriteAside
