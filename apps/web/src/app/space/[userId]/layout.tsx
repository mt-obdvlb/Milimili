import React from 'react'

const SpaceLayout = async ({
  params,
  children,
}: {
  params: Promise<{ userId: string }>
  children: React.ReactNode
}) => {
  console.log(await params)
  return <>{children}</>
}

export default SpaceLayout
