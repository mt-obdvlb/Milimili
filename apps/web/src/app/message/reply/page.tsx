import MessageReplyList from '@/features/message/components/reply/MessageReplyList'
import MessageCommonHeader from '@/features/message/components/common/MessageCommonHeader'

const MessageReply = () => {
  return (
    <div className={'h-full'}>
      <MessageCommonHeader title={'回复我的'} />
      <div className={'relative h-[calc(100%-42px)] p-2.5 pr-0'}>
        <div className={'w-full h-full overflow-y-auto overflow-x-hidden'}>
          <div className={'w-full rounded-[4px] bg-bg1 shadow-[0_2px_4px_0_rgba(121,146,185,.54)]'}>
            <MessageReplyList />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MessageReply
