import SpaceRelationWrapper from '@/features/space/components/relation/SpaceRelationWrapper'

const SpaceRelationFans = async ({ params }: { params: Promise<{ userId: string }> }) => {
  const { userId } = await params
  if (!userId) return null

  return <SpaceRelationWrapper type={'follower'} title={'全部粉丝'} userId={userId} />
}

export default SpaceRelationFans
