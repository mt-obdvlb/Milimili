import { ReactNode } from 'react'
import SpaceUploadWrapper from '@/features/space/components/upload/SpaceUploadWrapper'

const SpaceUploadLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className={'mt-[30px] flex relative'}>
      <SpaceUploadWrapper>{children}</SpaceUploadWrapper>
    </div>
  )
}

export default SpaceUploadLayout
