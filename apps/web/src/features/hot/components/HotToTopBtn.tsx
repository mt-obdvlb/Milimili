'use client'

import ToTopBtn from '@/components/ui/ToTopBtn'
import { useShow } from '@/hooks/useShow'

const HotToTopBtn = () => {
  const { isShow } = useShow()
  return (
    <ToTopBtn
      inlineClassName={
        'text-text1 p-0 border-line_regular bg-bg1_float fixed right-[30px] bottom-25 z-30 flex size-10 cursor-pointer flex-col items-center justify-center rounded-[8px] border text-center text-xs transition duration-200'
      }
      isShow={isShow}
    />
  )
}

export default HotToTopBtn
