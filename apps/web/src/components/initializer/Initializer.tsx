import { StoreInitializer } from '@/components/initializer/StoreInitializer'
import { Toaster } from '@/components/ui/sonner'

const Initializer = () => {
  const initialUser = {}
  return (
    <>
      <StoreInitializer initialUser={initialUser} />
      <Toaster />
    </>
  )
}

export default Initializer
