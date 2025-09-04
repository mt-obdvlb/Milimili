'use client'

import { DatePickerMode } from '@/components/layout/date-picker/DatePickerRoot'
import { Dispatch, ReactNode, SetStateAction } from 'react'
import DatePickerYear from '@/components/layout/date-picker/DatePickerYear'
import DatePickerMonth from '@/components/layout/date-picker/DatePickerMonth'

const DatePickerContent = ({
  mode,
  setMode,
  children,
}: {
  mode: DatePickerMode
  setMode: Dispatch<SetStateAction<DatePickerMode>>
  children?: ReactNode
}) => {
  if (mode === 'normal') {
    return <>{children}</>
  }
  if (mode === 'year') {
    return <DatePickerYear setMode={setMode} />
  }
  return <DatePickerMonth setMode={setMode} />
}

export default DatePickerContent
