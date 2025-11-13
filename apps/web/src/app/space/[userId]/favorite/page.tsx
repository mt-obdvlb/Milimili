import SpaceFavoriteWrapper from '@/features/space/components/favorite/SpaceFavoriteWrapper'
import SpaceFavoriteAside from '@/features/space/components/favorite/SpaceFavoriteAside'

const SpaceFavorite = async ({ params }: { params: Promise<{ userId: string }> }) => {
  const { userId } = await params
  if (!userId) return null
  return (
    <div className={'flex'}>
      <aside className={'mt-4.5 sticky pb-5 top-16 pr-[5px] shrink-0 mr-4 w-[195px]'}>
        <SpaceFavoriteAside userId={userId} />
      </aside>
      <main className={'mt-[30px] flex-1 pb-10'}>
        <SpaceFavoriteWrapper />
      </main>
    </div>
  )
}

export default SpaceFavorite
