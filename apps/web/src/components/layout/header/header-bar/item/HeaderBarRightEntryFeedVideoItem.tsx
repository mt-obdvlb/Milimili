'use client'

import { FeedRecentItem } from '@mtobdvlb/shared-types'
import { tv } from 'tailwind-variants'
import Link from 'next/link'
import Image from 'next/image'
import { formatWatchAt, openNewTab } from '@/utils'
import { cn, toastBuilding } from '@/lib'

const HeaderBarRightEntryFeedVideoItem = ({ feed }: { feed: FeedRecentItem }) => {
  const feedStyles = tv({
    slots: {
      base: 'py-3 px-5 flex flex-col cursor-pointer transition duration-300 hover:bg-graph_bg_regular ',
      container: 'flex flex-row',
      boxLeft: 'w-9 flex flex-col justify-start items-center relative',
      boxCenter: 'w-[260px] flex flex-col justify-start items-start px-3',
      boxRight: 'w-16 relative top-5 mb-5 flex flex-col justify-start items-center',
      boxLeftDynamicAvatar:
        'z-2 relative block size-[38px] border-2 border-graph_bg_thick rounded-full',
      boxLeftAvatar: 'size-full block relative rounded-full',
      avatar:
        'top-0 left-0 translate-z-0 will-change-transform rounded-full border-none block object-cover absolute',
      boxCenterNameLine: 'inline-block text-[13px] text-text2',
      boxCenterName: 'flex items-center',
      username: 'line-clamp-1 break-words text-ellipsis overflow-hidden',
      boxCenterInfo:
        'line-clamp-3 text-ellipsis overflow-hidden mt-1 text-sm text-text1 font-medium max-w-50',
      boxCenterTitle: 'text-sm leading-5 line-clamp-3',
      boxCenterTime: 'text-text3 text-xs inline-block',
      boxRightCover:
        'w-[82px] h-[46px] rounded-[4px] bg-graph_bg_thick bg-center bg-repeat flex justify-center items-center overflow-hidden',
      image: 'relative inline-block leading-[1] size-full align-middle bg-graph_bg_regular',
      img: 'block size-full',
      watchLater:
        'hidden group-hover:block absolute size-7 pt-[3px] pl-[3px] rounded-[6px] text-left  bg-[rgba(33,33,33,0.8)]',
    },
  })

  const {
    base,
    boxRight,
    boxLeft,
    boxCenter,
    container,
    boxLeftAvatar,
    boxLeftDynamicAvatar,
    avatar,
    boxCenterInfo,
    boxCenterName,
    boxCenterNameLine,
    boxCenterTime,
    boxCenterTitle,
    username,
    img,
    image,
    boxRightCover,
    watchLater,
  } = feedStyles()

  return (
    <div onClick={() => openNewTab(`/video/${feed.video.id}`)}>
      <div className={base()}>
        <div className={container()}>
          <div className={boxLeft()}>
            <Link
              href={`/apps/web/src/app/(with-auth)/space/${feed.user.id}`}
              target={'_blank'}
              className={boxLeftDynamicAvatar()}
            >
              <div className={boxLeftAvatar()}>
                <Image src={feed.user.avatar} alt={feed.user.name} fill className={avatar()} />
              </div>
            </Link>
          </div>
          <div className={boxCenter()}>
            <div className={boxCenterNameLine()}>
              <div className={boxCenterName()}>
                <Link
                  target={'_blank'}
                  href={`/apps/web/src/app/(with-auth)/space/${feed.user.id}`}
                  className={username()}
                >
                  {feed.user.name}
                </Link>
              </div>
            </div>
            <div className={boxCenterInfo()}>
              <div className={boxCenterTitle()}>{feed.video.title}</div>
            </div>
            <div className={boxCenterTime()}>{formatWatchAt(feed.video.publishedAt)}</div>
          </div>
          <div className={boxRight()}>
            <div className={cn(boxRightCover(), 'group')}>
              <picture className={image()}>
                <img src={feed.video.thumbnail} className={img()} alt={feed.video.title} />
              </picture>
              <div onClick={toastBuilding} className={cn(watchLater(), 'cursor-pointer')}>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                  width='24'
                  height='24'
                  className={'size-[22px] text-white'}
                >
                  <path
                    d='M12 3.74976C7.44366 3.74976 3.75001 7.44341 3.75001 11.9998C3.75001 16.5561 7.44366 20.2498 12 20.2498C14.27795 20.2498 16.339 19.32755 17.83275 17.8343C18.12565 17.5415 18.6005 17.54155 18.8934 17.83445C19.1862 18.1274 19.1861 18.6023 18.8932 18.89515C17.1297 20.65805 14.69165 21.7498 12 21.7498C6.61523 21.7498 2.25001 17.38455 2.25001 11.9998C2.25001 6.61498 6.61523 2.24976 12 2.24976C17.38475 2.24976 21.75 6.61498 21.75 11.9998C21.75 12.36535 21.72985 12.72655 21.69055 13.08215C21.645 13.4939 21.27435 13.79075 20.8627 13.7452C20.451 13.6997 20.1541 13.32905 20.1996 12.91735C20.2329 12.61635 20.25 12.3102 20.25 11.9998C20.25 7.44341 16.55635 3.74976 12 3.74976z'
                    fill='currentColor'
                  ></path>
                  <path
                    d='M18.4697 10.9694C18.76255 10.6765 19.23745 10.6765 19.53035 10.9694L21 12.43905L22.4697 10.9694C22.76255 10.6765 23.23745 10.6765 23.53035 10.9694C23.8232 11.26235 23.8232 11.73715 23.53035 12.0301L21.7071 13.8533C21.3166 14.2438 20.68345 14.2438 20.2929 13.8533L18.4697 12.0301C18.1768 11.73715 18.1768 11.26235 18.4697 10.9694z'
                    fill='currentColor'
                  ></path>
                  <path
                    d='M14.9992 11.13405C15.6657 11.5188 15.6657 12.4808 14.9992 12.86555L11.2487 15.03095C10.58225 15.4157 9.74913 14.9347 9.74913 14.16515L9.74913 9.83448C9.74913 9.06488 10.58225 8.58388 11.2487 8.96868L14.9992 11.13405z'
                    fill='currentColor'
                  ></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeaderBarRightEntryFeedVideoItem
