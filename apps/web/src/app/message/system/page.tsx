import MessageCommonHeader from '@/features/message/components/common/MessageCommonHeader'
import MessageSystemList from '@/features/message/components/system/MessageSystemList'

const MessageSystem = () => {
  return (
    <div className={'h-full'}>
      <MessageCommonHeader title={'系统通知'} />
      <div className={'relative h-[calc(100%-42px)] p-2.5 pr-0'}>
        <div className={'size-full overflow-y-auto overflow-x-hidden'}>
          <MessageSystemList />
        </div>
      </div>
    </div>
  )
}

export default MessageSystem
