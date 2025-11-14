import { ReactNode } from 'react'
import SpaceHeader from '@/features/space/components/SpaceHeader'
import SpaceTabs from '@/features/space/components/SpaceTabs'
import { getUserById } from '@/services'
import HeaderBarWrapper from '@/components/layout/header/header-bar/HeaderBarWrapper'
import '@/styles/font_3.css'
import { ToTopBtnWrapper } from '@/components'
import { cn } from '@/lib'
import { redirect } from 'next/navigation'

const SpaceLayout = async ({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ userId: string }>
}) => {
  const { userId } = await params
  const { data: user } = await getUserById(userId ?? '')
  if (!user) return redirect('/space')
  return (
    <>
      <header className={'h-[64px]'}>
        <HeaderBarWrapper allFirst />
      </header>
      <div className={'-mt-16 mx-auto max-w-[2560px] min-w-[1100px]'}>
        <div
          className={'pointer-events-none -z-1 fixed inset-0 bg-[top_center] bg-no-repeat bg-cover'}
        ></div>
        <SpaceHeader user={user} />
        <div className={'sticky z-10 top-0 bg-bg1 shadow-[0_0_0_1px_var(--bg2_float)]'}>
          <SpaceTabs user={user} />
        </div>
        <main className={'min-w-[1100px] max-w-[2260px] mx-auto min-h-[calc(100vh-294px)] px-15'}>
          {children}
          <div
            className={
              'z-1 fixed right-2.5 bottom-5 w-[42px] h-[150px] text-xs left-[calc(100%-52px)]'
            }
          >
            <ToTopBtnWrapper
              y={500}
              inlineClassName={cn('bg-bg1_float')}
              className={'relative size-10 mt-1.5 '}
            />
          </div>
        </main>
      </div>
    </>
  )
}

export default SpaceLayout
