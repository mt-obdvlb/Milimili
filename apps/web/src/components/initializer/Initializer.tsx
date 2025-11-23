import { StoreInitializer } from '@/components/initializer/StoreInitializer'
import { Toaster } from '@/components/ui/sonner'
import { getUser } from '@/services/user'
import { DanmakuInitializer } from '@/components/initializer/DanmakuInitializer'
import { SocketInitializer } from '@/components'

const Initializer = async () => {
  const [{ data }] = await Promise.all([getUser()])
  return (
    <>
      <DanmakuInitializer />
      <StoreInitializer initialUser={{ user: data }} />
      <Toaster />
      <SocketInitializer />
    </>
  )
}

export default Initializer
