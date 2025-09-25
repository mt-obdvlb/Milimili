'use client'

import { ReactNode } from 'react'
import { useUserGetByName } from '@/features'
import Link from 'next/link'

const AtItem = ({ name }: { name: string }) => {
  const username = name.slice(1)
  const { data } = useUserGetByName(username)
  if (data?.id) {
    return (
      <Link href={`/space/${data.id}`} target={'_blank'} className='text-brand_blue '>
        {name}
      </Link>
    )
  }

  return <span>{name}</span>
}

const WithAt = ({ children }: { children: string }) => {
  const parts = children.split(/(@[\u4e00-\u9fa5\w]+)/g)

  const nodes: ReactNode[] = parts.map((part, idx) => {
    if (/^@[\u4e00-\u9fa5\w]+$/.test(part)) {
      return <AtItem key={idx} name={part} />
    }
    return <span key={idx}>{part}</span>
  })

  return <>{nodes}</>
}

export default WithAt
