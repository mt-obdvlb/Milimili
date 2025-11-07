import SpaceRelationWrapper from '@/features/space/components/relation/SpaceRelationWrapper'

const SpaceRelationFollow = async ({ params }: { params: Promise<{ userId: string }> }) => {
  const { userId } = await params
  if (!userId) return null

  return <SpaceRelationWrapper type={'following'} title={'全部关注'} userId={userId} />
}

export default SpaceRelationFollow
