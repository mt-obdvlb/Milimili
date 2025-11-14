import HeaderBarTypeTwoWrapper from '@/components/layout/header/header-bar/HeaderBarTypeTwoWrapper'
import HistoryWrapper from '@/features/history/components/HistoryWrapper'

const History = () => {
  return (
    <>
      <header>
        <HeaderBarTypeTwoWrapper />
      </header>
      <main className={'min-h-[calc(100vh-64px)] min-w-[1060px]'}>
        <HistoryWrapper />
      </main>
    </>
  )
}

export default History
