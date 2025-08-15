import HeaderBanner from '@/features/home/components/header/HeaderBanner'
import HeaderChannel from '@/features/home/components/header/HeaderChannel'
import HeaderBar from '@/components/layout/HeaderBar'

const Home = () => {
  return (
    <>
      <header className={'relative max-h-[2560px] min-h-[64px] bg-white'}>
        <HeaderBar />
        <HeaderBanner />
        <HeaderChannel />
      </header>
      <main className={'min-h-[calc(100vh-64px)] bg-red-500'}></main>
    </>
  )
}

export default Home
