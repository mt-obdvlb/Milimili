import SpaceUploadVideoWrapper from '@/features/space/components/upload/SpaceUploadVideoWrapper'

const SpaceUploadVideo = async ({ params }: { params: Promise<{ userId: string }> }) => {
  const { userId } = await params
  if (!userId) return null

  return <SpaceUploadVideoWrapper userId={userId} />
}

export default SpaceUploadVideo
