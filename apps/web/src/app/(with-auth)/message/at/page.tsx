import MessageCommonHeader from '@/features/message/components/common/MessageCommonHeader'
import MessageAtList from '@/features/message/components/at/MessageAtList'

const MessageAt = () => {
  return (
    <div className={'h-full'}>
      <MessageCommonHeader title={'@ 我的'} />
      <div className={'relative h-[calc(100%-42px)] p-2.5 pr-0'}>
        <div className={'w-full h-full overflow-y-auto overflow-x-hidden'}>
          <div className={'w-full rounded-[4px] bg-bg1 shadow-[0_2px_4px_0_rgba(121,146,185,.54)]'}>
            <MessageAtList />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MessageAt
