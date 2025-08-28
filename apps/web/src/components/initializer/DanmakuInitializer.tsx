'use client'

import Script from 'next/script'

export const DanmakuInitializer = () => {
  return (
    <>
      <Script
        src='/comment-core-library/dist/CommentCoreLibrary.js'
        strategy='afterInteractive' // 页面渲染后加载
      />
    </>
  )
}
