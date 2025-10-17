import MessageWhisperConversationWrapper from '@/features/message/components/whisper/MessageWhisperConversationWrapper'

const MessageWhisperIdPage = async ({ params }: { params: Promise<{ userId: string }> }) => {
  const { userId } = await params

  return <MessageWhisperConversationWrapper userId={userId} />
}

export default MessageWhisperIdPage
