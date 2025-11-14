import { ReactNode } from 'react'
import SpaceRelationTabs from '@/features/space/components/SpaceRelationTabs'

const SpaceRelatoinLayout = async ({ children }: { children: ReactNode }) => {
  return (
    <div className={'flex text-text1'}>
      <SpaceRelationTabs />
      {children}
    </div>
  )
}

export default SpaceRelatoinLayout
