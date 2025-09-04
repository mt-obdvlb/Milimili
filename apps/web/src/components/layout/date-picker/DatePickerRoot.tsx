'use client'

import React, { HTMLAttributes, Ref, useState } from 'react'
import DatePickerHeader from '@/components/layout/date-picker/DatePickerHeader'
import DatePickerContent from '@/components/layout/date-picker/DatePickerContent'

export type DatePickerMode = 'normal' | 'year' | 'month'

const DatePickerRoot = ({
  children,
}: {
  rootRef?: Ref<HTMLDivElement> | undefined
} & HTMLAttributes<HTMLDivElement>) => {
  const [mode, setMode] = useState<DatePickerMode>('normal')

  return (
    <div className='relative w-full'>
      <DatePickerHeader mode={mode} setMode={setMode} />
      <DatePickerContent children={children} mode={mode} setMode={setMode} />
    </div>
  )
}

export default DatePickerRoot
