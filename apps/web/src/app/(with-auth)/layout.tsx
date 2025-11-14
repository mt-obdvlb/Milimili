import { ReactNode } from 'react'
import { getUserHomeInfo } from '@/features'
import { redirect } from 'next/navigation'

const WithAuthLayout = async ({ children }: { children: ReactNode }) => {
  const { userHomeInfo } = await getUserHomeInfo()
  if (!userHomeInfo?.user.id) redirect('/login')
  return <>{children}</>
}

export default WithAuthLayout
