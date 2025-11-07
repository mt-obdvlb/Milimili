import { redirect } from 'next/navigation'
import SpaceHomeFavoriteWrapper from '@/features/space/components/home/SpaceHomeFavoriteWrapper'
import SpaceHomeLikeListWrapper from '@/features/space/components/home/SpaceHomeLikeListWrapper'

const Space = async ({ params }: { params: Promise<{ userId: string }> }) => {
  const { userId } = await params
  if (!userId) redirect('/space')
  return (
    <div className={'mt-[30px] flex'}>
      <div className={'flex-1 shrink-0'}>
        <section>
          <SpaceHomeFavoriteWrapper userId={userId} />
        </section>
        <section>
          <SpaceHomeLikeListWrapper userId={userId} />
        </section>
      </div>
      <div className={'shrink-0 w-[240px] ml-9'}></div>
    </div>
  )
}

export default Space
