import Image from 'next/image'

const SearchEmpty = () => {
  return (
    <div className={'relative h-[calc(100vh-690px)] min-h-[340px]'}>
      <div className={'absolute top-[50%] left-1/2 -translate-1/2 text-center'}>
        <Image src={'/images/empty.png'} width={320} height={181} alt={'今天真是寂寞如雪啊~'} />
        <p className={'text-text3 my-[5px] mt-[15px] text-sm leading-[1.35] font-normal'}>
          今天真是寂寞如雪啊~
        </p>
      </div>
    </div>
  )
}

export default SearchEmpty
