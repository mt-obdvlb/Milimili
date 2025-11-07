import { VideoListItem } from '@mtobdvlb/shared-types'
import TinyVideoItem from '@/components/layout/video/TinyVideoItem'
import Link from 'next/link'

const SpaceHomeListLikeItem = ({ video }: { video: VideoListItem }) => {
  return (
    <div className={'relative flex flex-col'}>
      <div className={'relative overflow-hidden z-1 bg-graph_bg_thick pt-[56.25%]'}>
        <TinyVideoItem video={video} />
      </div>
      <div className={'mt-2.5 flex flex-col'}>
        <div
          className={
            'relative pr-4 text-[15px] leading-[22px] h-[22px] text-text1 hover:text-brand_blue line-clamp-2 text-ellipsis font-medium break-all '
          }
        >
          <Link
            href={`/video/${video.id}`}
            target={'_blank'}
            className={'cursor-pointer transition-colors duration-200 '}
          >
            {video.title}
          </Link>
        </div>
        <div className={'mt-1 text-[13px] leading-4.5 h-4.5 text-text3 items-center flex'}>
          <Link href={`/space/${video.userId}`} target={'_blank'}>
            <i className={'sic-BDC-uploader_name_square_line'}></i>
            <div className={'ml-0.5'}>{video.username}</div>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SpaceHomeListLikeItem
