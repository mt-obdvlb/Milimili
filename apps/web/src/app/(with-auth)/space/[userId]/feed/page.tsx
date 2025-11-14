import SpaceFeedWrapper from '@/features/space/components/feed/SpaceFeedWrapper'

const SpaceFeed = async ({ params }: { params: Promise<{ userId: string }> }) => {
  const { userId } = await params

  if (!userId) return null

  return (
    <div className={'mt-[30px] flex'}>
      <SpaceFeedWrapper userId={userId} />
    </div>
  )
}

export default SpaceFeed
