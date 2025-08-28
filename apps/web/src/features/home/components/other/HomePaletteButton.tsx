'use client'

import { tv } from 'tailwind-variants'
import { useRotation } from '@/hooks/useRotation'
import { cn } from '@/lib'
import { useQueryClient } from '@tanstack/react-query'
import ToTopBtn from '@/components/ui/ToTopBtn'
import { useShow } from '@/hooks/useShow'

const HomePaletteButton = () => {
  const paletteButtonStyles = tv({
    slots: {
      base: 'fixed inset-0 z-10 bg-transparent translate-z-0 pointer-events-none',
      inner: 'relative size-full',
      wrap: cn('left-[1339px] fixed bottom-[30px] text-center translate-2.5 '),
      roll: cn(
        'relative size-10 flex items-center justify-end mt-1.5 cursor-pointer pointer-events-auto '
      ),
      top: 'block text-center',
    },
  })
  const { rotate, style } = useRotation()
  const queryClient = useQueryClient()

  const handleRoll = async () => {
    rotate()
    await queryClient.invalidateQueries({ queryKey: ['video', 'recommend'] })
  }

  const { isShow } = useShow()

  const { base, top, roll, wrap, inner } = paletteButtonStyles()
  return (
    <div className={base()}>
      <div className={inner()}>
        <div className={wrap()}>
          <div className={roll()}>
            <div
              className={cn(
                'bg-brand_blue group flex h-10 shrink-0 items-center justify-end rounded-[6px] px-2 text-sm font-normal text-white transition-opacity duration-300 hover:bg-[#40C5F1]',
                isShow ? 'opacity-100' : 'opacity-0'
              )}
              onClick={handleRoll}
            >
              <svg
                data-v-d05c53ac=''
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                width='24'
                height='24'
                className={'size-6 transition-all duration-500'}
                fill='currentColor'
                style={style}
              >
                <path
                  d='M12 4.5C7.85786 4.5 4.5 7.85786 4.5 12C4.5 16.1421 7.85786 19.5 12 19.5C14.0667 19.5 15.9365 18.6654 17.2941 17.3125C17.6853 16.9226 18.3185 16.9237 18.7083 17.3149C19.0982 17.7061 19.0971 18.3393 18.7059 18.7291C16.9887 20.4404 14.6172 21.5 12 21.5C6.75329 21.5 2.5 17.2467 2.5 12C2.5 6.75329 6.75329 2.5 12 2.5C17.2467 2.5 21.5 6.75329 21.5 12C21.5 12.356 21.4804 12.7078 21.4421 13.0543C21.3814 13.6033 20.8872 13.9991 20.3382 13.9384C19.7893 13.8777 19.3935 13.3835 19.4542 12.8346C19.4844 12.5609 19.5 12.2825 19.5 12C19.5 7.85786 16.1421 4.5 12 4.5z'
                  fill='currentColor'
                ></path>
                <path
                  d='M17.2929 10.7929C17.6834 10.4024 18.3166 10.4024 18.7071 10.7929L20.5 12.5858L22.2929 10.7929C22.6834 10.4024 23.3166 10.4024 23.7071 10.7929C24.0976 11.1834 24.0976 11.8166 23.7071 12.2071L21.3839 14.5303C20.8957 15.0185 20.1043 15.0185 19.6161 14.5303L17.2929 12.2071C16.9024 11.8166 16.9024 11.1834 17.2929 10.7929z'
                  fill='currentColor'
                ></path>
              </svg>
              <div
                className={
                  'flex max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-500 ease-linear group-hover:max-w-[110px] group-hover:opacity-100'
                }
              >
                <span className={'pr-0.5 pl-1.5'}>刷新内容</span>
              </div>
            </div>
          </div>
          <ToTopBtn className={top()} isShow={isShow} />
        </div>
      </div>
    </div>
  )
}

export default HomePaletteButton
