import { cn, toast } from '@/lib'
import { useFavoriteDeleteBatch } from '@/features'

const WatchLaterDeleteBtn = ({
  className,
  favoriteId,
}: {
  className?: string
  favoriteId: string
}) => {
  const { favoriteDelete } = useFavoriteDeleteBatch()
  const handleClick = async () => {
    const { code } = await favoriteDelete({ ids: [favoriteId] })
    if (code) return
    toast('已删除视频')
  }
  return (
    <div
      className={cn(
        'text-text3 hover:text-brand_blue absolute cursor-pointer text-lg text-[22px]',
        className
      )}
      onClick={handleClick}
    >
      <i
        className={'sic-BDC-trash_delete_line inline-block align-baseline leading-[1] font-normal'}
      ></i>
    </div>
  )
}

export default WatchLaterDeleteBtn
