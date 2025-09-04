'use client'
import React, { createContext, useContext } from 'react'
import { DateRange } from 'react-day-picker'

interface DatePickerContextType {
  range: DateRange | undefined
  setRange: React.Dispatch<React.SetStateAction<DateRange | undefined>>
}

const DatePickerContext = createContext<DatePickerContextType | null>(null)

export const DatePickerProvider = DatePickerContext.Provider
export const useDatePicker = () => {
  const ctx = useContext(DatePickerContext)
  if (!ctx) throw new Error('useDatePicker must be used inside DatePickerProvider')
  return ctx
}
