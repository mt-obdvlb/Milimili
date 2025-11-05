import { redirect } from 'next/navigation'

const Relation = async ({ params }: { params: Promise<{ userId: string }> }) => {
  const { userId } = await params
  if (!userId) redirect('/space')
  redirect(`/space/${userId}/relation/fans`)
}

export default Relation
