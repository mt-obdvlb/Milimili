const SpaceFeed = async ({ params }: { params: Promise<{ userId: string }> }) => {
  const { userId } = await params

  if (!userId) return null

  return <>SpaceFeed</>
}

export default SpaceFeed
