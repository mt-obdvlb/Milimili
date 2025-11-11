import PlatformHeader from '@/features/platform/components/PlatformHeader'
import { ReactNode } from 'react'
import PlatformNav from '@/features/platform/components/PlatformNav'

const PlatformLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className={'size-full bg-[fafafa]'}>
      <header className={'h-15 fixed top-0 inset-x-0 z-900 min-w-[960px]'}>
        <PlatformHeader />
      </header>
      <div className={'h-full'}>
        <nav
          className={
            'pt-15 w-50 border-r border-r-[#f4f4f4] fixed top-0 left-0 h-full z-10 bg-[#fff] overflow-hidden'
          }
        >
          <PlatformNav />
        </nav>
        <div className={'h-full ml-50 pt-15 min-w-[1124px] flow-root min-h-full'}>
          <div
            className={
              'overflow-visible h-auto min-h-[calc(100vh-76px)] pl-[calc(100vw-100%-200px)] bg-[#fafafa] py-10 text-[#999] text-[16px]'
            }
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlatformLayout
