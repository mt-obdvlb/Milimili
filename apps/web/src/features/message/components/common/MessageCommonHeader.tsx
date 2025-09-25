const MessageCommonHeader = ({ title }: { title: string }) => {
  return (
    <div
      className={
        'rounded-[4px] bg-bg1 shadow-[0_2px_4px_0_rgba(121,146,185,.54)] w-[calc(100%-20px)] mx-2.5 px-4 h-[42px] text-[15px] text-text2 flex items-center justify-baseline'
      }
    >
      <div>
        <span>{title}</span>
      </div>
    </div>
  )
}

export default MessageCommonHeader
