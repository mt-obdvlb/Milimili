const MessageCommonItemCover = ({ content }: { content: string }) => {
  return (
    <div className={'absolute right-0 -top-[7px] size-15'}>
      {content.startsWith('http') ? (
        <div
          className={
            'size-full rounded-[2px] overflow-hidden line-clamp-4 text-text3 text-sm leading-[14px] bg-[#f1f2f3] relative'
          }
        >
          <picture className={'size-full inline-block align-middle'}>
            <img src={content} alt={content} className={'block size-full'} />
          </picture>
        </div>
      ) : (
        <div className={'size-full line-clamp-4 text-sm leading-[15px] text-ellipsis text-text3 '}>
          {content}
        </div>
      )}
    </div>
  )
}

export default MessageCommonItemCover
