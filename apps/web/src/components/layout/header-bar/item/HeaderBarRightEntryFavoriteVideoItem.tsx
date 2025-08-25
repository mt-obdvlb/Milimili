import { tv } from 'tailwind-variants'
import Link from 'next/link'
import { formatTime } from '@/utils'
import { FavoriteListItem } from '@mtobdvlb/shared-types'

const HeaderBarRightEntryFavoriteVideoItem = ({ favorite }: { favorite: FavoriteListItem }) => {
  const favoriteStyles = tv({
    slots: {
      base: 'flex py-2.5 pr-2.5 pl-5 transition-colors duration-300 bg-transparent hover:bg-graph_bg_thick ',
      image: 'relative shrink-0 mr-2.5 w-[128px] h-[72px] rounded-[4px]  ',
      img: 'rounded-[4px] block size-full',
      duration: 'absolute right-1 bottom-1 p-0 rounded-0.5 bg-[rgba(0,0,0,0.4)] leading-[17px]',
      durationText: 'inline-block text-white text-xs leading-3.5 scale-85 origin-center',
      progress:
        'absolute bottom-0 w-full h-[3px] rounded-b-[4px] rounded-l-[4px] bg-[rgba(0,0,0,0.7)]',
      progressInner: ' rounded-none absolute bottom-0 h-[3px] bg-[#fb7199]',
      info: 'flex flex-1 flex-col justify-between',
      infoTitle:
        'font-medium mb-1 h-9 text-text1 text-sm leading-4.5 overflow-hidden text-ellipsis break-words line-clamp-2',
      infoDate: 'flex items-center text-text3 text-xs leading-4',
      infoDateIcon: 'size-4 mr-[3px]',
      infoName: 'flex items-center text-text3 text-xs leading-4',
      infoNameIcon: 'shrink-0 mr-[5px] size-4',
    },
  })

  const { base, img, image, durationText, duration, info, infoTitle, infoNameIcon, infoName } =
    favoriteStyles()

  return (
    <Link href={`/video/${favorite.video.id}`} className={base()}>
      <div className={image()}>
        <picture className={image()}>
          <img className={img()} src={favorite.video.thumbnail} alt={favorite.video.title} />
        </picture>
        <div className={duration()}>
          <span className={durationText()}>{formatTime(favorite.video.time)}</span>
        </div>
      </div>
      <div className={info()}>
        <div className={infoTitle()}>{favorite.video.title}</div>
        <div className={infoName()}>
          <svg
            width='16'
            height='16'
            viewBox='0 0 16 16'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            className={infoNameIcon()}
          >
            <path
              fillRule='evenodd'
              clipRule='evenodd'
              d='M1.33334 5.16669C1.33334 3.78597 2.45263 2.66669 3.83334 2.66669H12.1667C13.5474 2.66669 14.6667 3.78597 14.6667 5.16669V10.8334C14.6667 12.2141 13.5474 13.3334 12.1667 13.3334H3.83334C2.45263 13.3334 1.33334 12.2141 1.33334 10.8334V5.16669ZM3.83334 3.66669C3.00492 3.66669 2.33334 4.33826 2.33334 5.16669V10.8334C2.33334 11.6618 3.00492 12.3334 3.83334 12.3334H12.1667C12.9951 12.3334 13.6667 11.6618 13.6667 10.8334V5.16669C13.6667 4.33826 12.9951 3.66669 12.1667 3.66669H3.83334ZM4.33334 5.50002C4.60949 5.50002 4.83334 5.72388 4.83334 6.00002V8.50002C4.83334 9.05231 5.28106 9.50002 5.83334 9.50002C6.38563 9.50002 6.83334 9.05231 6.83334 8.50002V6.00002C6.83334 5.72388 7.0572 5.50002 7.33334 5.50002C7.60949 5.50002 7.83334 5.72388 7.83334 6.00002V8.50002C7.83334 9.60459 6.93791 10.5 5.83334 10.5C4.72877 10.5 3.83334 9.60459 3.83334 8.50002V6.00002C3.83334 5.72388 4.0572 5.50002 4.33334 5.50002ZM9.00001 5.50002C8.72387 5.50002 8.50001 5.72388 8.50001 6.00002V10C8.50001 10.2762 8.72387 10.5 9.00001 10.5C9.27615 10.5 9.50001 10.2762 9.50001 10V9.33335H10.5833C11.6419 9.33335 12.5 8.47523 12.5 7.41669C12.5 6.35814 11.6419 5.50002 10.5833 5.50002H9.00001ZM10.5833 8.33335H9.50001V6.50002H10.5833C11.0896 6.50002 11.5 6.91043 11.5 7.41669C11.5 7.92295 11.0896 8.33335 10.5833 8.33335Z'
              fill='#999999'
            ></path>
          </svg>
          <span>{favorite.user.name}</span>
        </div>
      </div>
    </Link>
  )
}

export default HeaderBarRightEntryFavoriteVideoItem
