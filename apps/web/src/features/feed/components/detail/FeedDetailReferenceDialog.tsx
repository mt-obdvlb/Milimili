import { FeedGetById } from '@mtobdvlb/shared-types'
import {
  AtTextareaRef,
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components'
import { cn } from '@/lib'
import { useRef, useState } from 'react'
import AtTextarea from '@/components/layout/at/AtTextarea'
import AtTextareaPlaceholder from '@/components/layout/at/AtTextareaPlaceholder'
import FeedDetailDialogReferenceItem from '@/features/feed/components/detail/FeedDetailDialogReferenceItem'
import { useFeedTranspont } from '@/features'
import FeedSharedSuccess from '@/features/feed/components/detail/FeedSharedSuccess'

const FeedDetailReferenceDialog = ({ feed }: { feed: FeedGetById }) => {
  const [textCount, setTextCount] = useState(0)
  const atTextRef = useRef<AtTextareaRef>(null)
  const [feedSharedSuccessOpen, setFeedSharedSuccessOpen] = useState(false)
  const [open, setOpen] = useState(false)
  const { transpont } = useFeedTranspont()
  const [newFeedId, setNewFeedId] = useState<string | undefined>()

  const handleClick = async () => {
    const { code, data } = await transpont({
      feedId: feed.id,
      content: atTextRef.current?.getEditor()?.getText() || '转发动态',
    })
    if (code) return
    setOpen(false)
    setNewFeedId(data?.id)
    setFeedSharedSuccessOpen(open)
  }

  return (
    <>
      <FeedSharedSuccess
        href={`/feed/${newFeedId ?? ''}`}
        open={feedSharedSuccessOpen}
        setOpen={setFeedSharedSuccessOpen}
      />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div
            onClick={() => setOpen(true)}
            className={cn(
              'not-first-of-type:mt-4 cursor-pointer group hover:text-brand_blue relative w-[46px] flex flex-col items-center justify-between text-text3'
            )}
          >
            <svg
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
              className={'size-6 text-graph_icon group-hover:text-brand_blue'}
            >
              <path
                d='M11.7148 3.3904L12.1883 2.80873V2.80873L11.7148 3.3904ZM10.0835 7.11906L10.1675 7.86434C10.5469 7.82159 10.8335 7.50077 10.8335 7.11906H10.0835ZM2.40872 16.249L1.66281 16.1708L2.40872 16.249ZM3.41451 16.5323L2.78976 16.1174H2.78976L3.41451 16.5323ZM10.0835 12.9746H10.8335C10.8335 12.5859 10.5366 12.2616 10.1494 12.2275L10.0835 12.9746ZM11.7148 16.7765L11.2414 16.1948L11.7148 16.7765ZM18.5084 11.2469L18.035 10.6652H18.035L18.5084 11.2469ZM18.5085 8.92019L18.9819 8.33852L18.5085 8.92019ZM10.8335 4.16596C10.8335 3.95534 11.078 3.83911 11.2414 3.97206L12.1883 2.80873C11.0449 1.87805 9.33354 2.69168 9.33354 4.16596H10.8335ZM10.8335 7.11906V4.16596H9.33354V7.11906H10.8335ZM3.15463 16.3272C3.51573 12.883 4.69455 10.8613 6.01872 9.66171C7.35327 8.45275 8.91679 8.00533 10.1675 7.86434L9.99953 6.37378C8.54838 6.53736 6.65086 7.06509 5.01166 8.55003C3.36208 10.0444 2.05444 12.4353 1.66281 16.1708L3.15463 16.3272ZM2.78976 16.1174C2.84989 16.0268 2.94169 16.0279 2.97464 16.0369C2.99716 16.043 3.04471 16.0623 3.0897 16.1195C3.14262 16.1869 3.16079 16.2684 3.15463 16.3272L1.66281 16.1708C1.58766 16.8875 2.09197 17.3518 2.58225 17.4846C3.05748 17.6134 3.68033 17.4877 4.03925 16.9473L2.78976 16.1174ZM10.1494 12.2275C8.06107 12.0433 5.11428 12.6176 2.78976 16.1174L4.03925 16.9473C6.01112 13.9785 8.38309 13.5775 10.0177 13.7217L10.1494 12.2275ZM10.8335 16.0009V12.9746H9.33354V16.0009H10.8335ZM11.2414 16.1948C11.078 16.3278 10.8335 16.2116 10.8335 16.0009H9.33354C9.33354 17.4752 11.0449 18.2888 12.1883 17.3582L11.2414 16.1948ZM18.035 10.6652L11.2414 16.1948L12.1883 17.3582L18.9819 11.8285L18.035 10.6652ZM18.035 9.50185C18.4037 9.80199 18.4037 10.3651 18.035 10.6652L18.9819 11.8285C20.0881 10.9282 20.0881 9.23891 18.9819 8.33852L18.035 9.50185ZM11.2414 3.97206L18.035 9.50185L18.9819 8.33852L12.1883 2.80873L11.2414 3.97206Z'
                fill='currentColor'
              ></path>{' '}
              <path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M12.0126 2.74638C10.9645 1.89326 9.39575 2.63908 9.39575 3.9905V6.52347C8.04285 6.7607 6.42622 7.33445 5.01037 8.63537C3.36503 10.1472 2.06603 12.5719 1.70486 16.3755C1.64281 17.029 2.10319 17.4525 2.5535 17.5729C2.99132 17.6899 3.56409 17.5696 3.88706 17.0656C4.90489 15.4772 6.02606 14.6008 7.07814 14.1323C7.88831 13.7715 8.68279 13.6415 9.39575 13.6345V16.176C9.39575 17.5275 10.9645 18.2733 12.0126 17.4202L19.0613 11.683C20.0753 10.8576 20.0753 9.30912 19.0613 8.48377L12.0126 2.74638ZM10.7707 3.9905C10.7707 3.79744 10.9949 3.6909 11.1446 3.81277L18.1933 9.55016C18.5313 9.82528 18.5313 10.3414 18.1933 10.6166L11.1446 16.3538C10.9949 16.4756 10.7707 16.3691 10.7707 16.176V12.9744C10.7707 12.6181 10.4986 12.3209 10.1436 12.2896C9.10884 12.1983 7.8347 12.2902 6.51878 12.8763C5.36413 13.3904 4.20995 14.2707 3.17068 15.6812C3.60099 12.6381 4.70283 10.7852 5.94069 9.64786C7.29583 8.40271 8.89001 7.94525 10.1603 7.80206C10.508 7.76287 10.7707 7.46879 10.7707 7.11889V3.9905Z'
                fill='currentColor'
              ></path>
            </svg>
            <div className='select-none mt-1 text-xs leading-3.5'>{feed.references}</div>
          </div>
        </DialogTrigger>
        <DialogContent
          showCloseButton={false}
          className={
            'bg-bg1 border focus-visible:ring-0 outline-none focus-visible:inset-ring-0  border-line_regular rounded-[8px] shadow-[0_13px_20px_0_rgba(106,115,133,.22)] py-4 px-6  w-[570px]'
          }
        >
          <DialogHeader className={'text-[20px] text-text1'}>
            <DialogClose
              className={
                'flex items-center justify-center cursor-pointer text-text4 rounded-[4px] size-5 absolute right-6 top-4.5 transition-colors duration-200 hover:bg-bg3'
              }
            >
              <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' width='16' height='16'>
                <path
                  d='M3.1082399999999994 3.110086666666666C3.4011333333333327 2.81719 3.876006666666667 2.81719 4.168896666666666 3.110086666666666L7.9989333333333335 6.94015L11.830066666666667 3.108993333333333C12.12295 2.8160966666666667 12.597849999999998 2.8160966666666667 12.890716666666664 3.108993333333333C13.183683333333335 3.401883333333334 13.183683333333335 3.8767599999999995 12.890716666666664 4.169649999999999L9.059583333333332 8.0008L12.88985 11.831083333333334C13.182816666666668 12.12395 13.182816666666668 12.598849999999999 12.88985 12.891716666666664C12.59698333333333 13.1846 12.12208333333333 13.1846 11.8292 12.891716666666664L7.9989333333333335 9.06145L4.169766666666666 12.890666666666664C3.876866666666667 13.183533333333333 3.4019999999999997 13.183533333333333 3.1091 12.890666666666664C2.816209999999999 12.597699999999998 2.816209999999999 12.122883333333334 3.1091 11.830016666666667L6.938283333333333 8.0008L3.1082399999999994 4.170743333333332C2.8153433333333333 3.877853333333333 2.8153433333333333 3.4029766666666674 3.1082399999999994 3.110086666666666z'
                  fill='currentColor'
                ></path>
              </svg>
            </DialogClose>
            <DialogTitle className={'inline text-[20px] text-text1 font-normal'}>
              分享到动态
            </DialogTitle>
          </DialogHeader>
          <div className={'cursor-text mb-2.5 mt-1.5 min-h-[72px] relative'}>
            <div className={'max-h-[180px] cursor-text size-full relative overflow-y-auto'}>
              <AtTextareaPlaceholder className={'leading-6'} atTextCount={textCount}>
                来说说分享的理由？|´・ω・)ノ
              </AtTextareaPlaceholder>
              <AtTextarea
                onUpdate={(count) => {
                  setTextCount(count)
                }}
                ref={atTextRef}
                className={
                  'text-[15px] leading-6 min-h-6 pr-[5px] break-all break-words whitespace-pre-wrap tracking-[1px] bg-bg1 align-baseline outline-none'
                }
              />
            </div>
          </div>
          <FeedDetailDialogReferenceItem feedId={feed.referenceId ?? feed.id} />
          <DialogFooter className={'flex items-center justify-between mt-3'}>
            <div className={'flex relative items-center'}></div>
            <div className={'items-center flex justify-center'}>
              <div className={'text-text3 text-sm mr-5 relative select-none'}>
                {1000 - textCount}
              </div>
              <Button
                onClick={handleClick}
                className={
                  'items-center bg-brand_blue flex rounded-[4px] text-white cursor-pointer text-[13px] h-8 justify-center select-none w-[70px] hover:opacity-80 transition-opacity duration-200 opacity-100  '
                }
              >
                发布
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default FeedDetailReferenceDialog
