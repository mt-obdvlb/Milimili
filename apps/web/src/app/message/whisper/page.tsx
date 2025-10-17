import Image from 'next/image'

const MessageWhisper = () => {
  return (
    <div className={'z-2 size-full bg-bg2 relative flex flex-col rounded-r-[4px]'}>
      <div className={'size-full flex items-center justify-center flex-col'}>
        <Image
          src={'/images/gochat.png'}
          alt={'gochat'}
          className={'mb-8'}
          width={402}
          height={204}
        />
        <p className={'m-0 text-[#8d9fb9] text-sm leading-[1.5em]'}>
          快找小伙伴聊天吧 ( ゜- ゜)つロ
        </p>
      </div>
    </div>
  )
}

export default MessageWhisper
