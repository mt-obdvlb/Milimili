import { redirect } from 'next/navigation'
import { getUserHomeInfo } from '@/features'

const Space = async () => {
  const { userHomeInfo } = await getUserHomeInfo()
  if (!userHomeInfo?.user.id) redirect('')
  redirect(`/space/${userHomeInfo?.user.id}`)
}

export default Space
