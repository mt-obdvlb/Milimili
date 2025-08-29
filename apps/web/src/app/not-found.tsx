import NotFoundHeaderBarWrapper from '@/components/layout/header/header-bar/HeaderBarTypeTwoWrapper'
import NotFoundErrorPanel from '@/features/not-found/components/NotFoundErrorPanel'
import NotFoundErrorManga from '@/features/not-found/components/NotFoundErrorManga'

export const metadata = {
  title: '出错啦! - milimili.com',
}

const NotFound = () => {
  return (
    <div className={'bg-bg3 min-h-screen text-center'}>
      <header>
        <NotFoundHeaderBarWrapper />
      </header>
      <main className={'bg-bg1 mx-auto my-[30px] w-[980px] rounded-[10px]'}>
        <NotFoundErrorPanel />
        <div id={'up'} className={'h-10 w-full'}></div>
        <NotFoundErrorManga />
      </main>
    </div>
  )
}

export default NotFound
