import { redirect } from 'next/navigation'

const SpaceUpload = async ({ params }: { params: Promise<{ userId: string }> }) => {
  const { userId } = await params
  if (!userId) redirect('/space')
  redirect(`/space/${userId}/upload/video`)
}

export default SpaceUpload
