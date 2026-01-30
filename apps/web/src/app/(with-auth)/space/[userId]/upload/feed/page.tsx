import SpaceUploadFeedList from '@/features/space/components/upload/SpaceUploadFeedList'

const SpaceUploadFeed = async ({ params }: { params: Promise<{ userId: string }> }) => {
  const { userId } = await params
  if (!userId) return

  return (
    <div>
      <div className={'flex items-center flex-col min-h-[34px]'}>
        <SpaceUploadFeedList userId={userId} />
      </div>
    </div>
  )
}

export default SpaceUploadFeed
