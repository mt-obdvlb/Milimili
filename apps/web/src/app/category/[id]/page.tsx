import { getCategoryList, getCategoryName, getVideoList } from '@/features'
import HeaderBanner from '@/components/layout/header/header-banner/HeaderBanner'
import HeaderBarWrapper from '@/components/layout/header/header-bar/HeaderBarWrapper'
import HeaderChannel from '@/components/layout/header/header-channel/HeaderChannel'
import Image from 'next/image'
import CategoryMainVideoList from '@/features/category/components/CateogryMainVideoList'

const Category = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  const [{ categoryList }, { categoryName }, { videoSwiperList }] = await Promise.all([
    getCategoryList(),
    getCategoryName(id),
    getVideoList(),
  ])
  return (
    <>
      <header>
        <HeaderBanner />
        <HeaderBarWrapper />
        <HeaderChannel categoryName={categoryName} categoryList={categoryList} />
      </header>
      <main
        className={
          'mx-auto min-h-[calc(100vh-265px)] max-w-[calc(1980px+60px*2)] min-w-[1020px] px-15'
        }
      >
        <div>
          <div className={'mb-6 flex items-center'}>
            <Image
              src={`/svgs/category/icon_${(Math.random() * 44).toFixed(0)}.svg`}
              alt={'logo'}
              width={36}
              height={36}
              className={'mr-1.5'}
            />
            <div className={'text-text1 text-[28px] leading-10 font-medium'}>{categoryName}</div>
          </div>
          <div>
            <CategoryMainVideoList videoSwiperList={videoSwiperList} />
          </div>
        </div>
      </main>
    </>
  )
}

export default Category
