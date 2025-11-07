import SpaceUploadFeedList from '@/features/space/components/upload/SpaceUploadFeedList'

const SpaceUploadFeed = async ({ params }: { params: Promise<{ userId: string }> }) => {
  const { userId } = await params
  if (!userId) return

  return (
    <div>
      <div className={'flex items-center flex-col min-h-[34px]'}>
        <div className={'text-[24px] font-semibold text-text1'}>全部图文</div>
        <SpaceUploadFeedList userId={userId} />
      </div>
    </div>
  )
}

export default SpaceUploadFeed
