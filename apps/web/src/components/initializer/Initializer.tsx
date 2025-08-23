import { StoreInitializer } from '@/components/initializer/StoreInitializer'
import { Toaster } from '@/components/ui/sonner'
import { getUser } from '@/services/user'

const Initializer = async () => {
  const [{ data }] = await Promise.all([getUser()])
  return (
    <>
      <StoreInitializer initialUser={{ user: data }} />
      <Toaster />
    </>
  )
}

export default Initializer
