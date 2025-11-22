import { cn } from '@/lib'
import { Button } from '@/components'
import { ReactNode } from 'react'

const FavoriteFilterBtn = ({
  isExpend,
  label,
  svg,
  disabled,
  ...props
}: {
  isExpend: boolean
  svg: ReactNode
  label: string
  disabled?: boolean
}) => {
  return (
    <Button
      {...props}
      className={cn(
        'text-text1 bg-bg1_float border-line_regular text-4 flex h-[34px] max-w-30 min-w-25 cursor-pointer items-center justify-center rounded-md border px-3 leading-[1] whitespace-nowrap transition-all delay-100 duration-300 select-none',
        !isExpend && 'w-[34px] max-w-[34px] min-w-[34px] p-0',
        disabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-graph_bg_thick'
      )}
      disabled={disabled}
    >
      {svg}
      {isExpend && (
        <span
          className={'ml-1 max-w-25 overflow-hidden transition-all delay-[inherit] duration-300'}
        >
          {label}
        </span>
      )}
    </Button>
  )
}

export default FavoriteFilterBtn
