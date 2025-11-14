import MessageCommonHeader from '@/features/message/components/common/MessageCommonHeader'
import MessageLikeList from '@/features/message/components/like/MessageLikeList'

const MessageLike = () => {
  return (
    <div className={'h-full'}>
      <MessageCommonHeader title={'收到的赞'} />
      <div className={'relative h-[calc(100%-42px)] p-2.5 pr-0'}>
        <div className={'w-full h-full overflow-y-auto overflow-x-hidden'}>
          <div className={'w-full rounded-[4px] bg-bg1 shadow-[0_2px_4px_0_rgba(121,146,185,.54)]'}>
            <MessageLikeList />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MessageLike
