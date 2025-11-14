import Link from 'next/link'

const MessageCommonAvatar = ({ src, userId }: { src: string; userId: string }) => {
  if (!src) return null
  return (
    <div className={'pl-4 pt-6 shrink-0 size-15 relative box-content'}>
      <Link
        target={'_blank'}
        onClick={(e) => e.stopPropagation()}
        href={`/apps/web/src/app/(with-auth)/space/${userId}`}
        className={'size-[46px] block'}
      >
        <div className={'size-full bg-[#f1f2f3] overflow-hidden rounded-full relative'}>
          <picture className={'size-full inline-block align-middle'}>
            <img src={src} alt={userId} className={'block size-full'} />
          </picture>
        </div>
      </Link>
    </div>
  )
}

export default MessageCommonAvatar
