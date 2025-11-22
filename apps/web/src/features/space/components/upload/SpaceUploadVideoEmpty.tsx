import Image from 'next/image'

const SpaceUploadVideoEmpty = ({ title }: { title: string }) => {
  return (
    <div className={'flex flex-col items-center'}>
      <div className={'mb-1.5'}>
        <Image
          src={'/svgs/load-data-nothing.svg'}
          alt={'空间主人还没投过视频，这里什么也没有...'}
          width={100}
          height={100}
        />
      </div>
      <div className={'text-text3 text-center text-sm'}>
        空间主人还没投过{title}，这里什么也没有...
      </div>
    </div>
  )
}

export default SpaceUploadVideoEmpty
