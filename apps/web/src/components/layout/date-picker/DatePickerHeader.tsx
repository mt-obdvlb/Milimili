'use client'

import React, { Dispatch, SetStateAction } from 'react'
import { useDayPicker } from 'react-day-picker'
import { DatePickerMode } from '@/components/layout/date-picker/DatePickerRoot'
import { cn } from '@/lib'

const DatePickerHeader = ({
  mode,
  setMode,
}: {
  mode: DatePickerMode
  setMode: Dispatch<SetStateAction<DatePickerMode>>
}) => {
  const { months, goToMonth, previousMonth, nextMonth, dayPickerProps, components } = useDayPicker()

  const currentMonth = months?.[0]?.date ?? dayPickerProps?.month ?? new Date()
  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth() + 1
  const { NextMonthButton, PreviousMonthButton, CaptionLabel } = components
  const today = new Date()
  const thisYear = today.getFullYear()
  const thisMonth = today.getMonth() + 1

  // 限制最小月份
  const minYear = 2009
  const minMonth = 1

  // 是否禁用下个月按钮（到达当前年月）
  const isNextDisabled = year === thisYear && month === thisMonth
  // 是否禁用上个月按钮（到达 2009-01）
  const isPrevDisabled = year === minYear && month === minMonth
  return (
    <div
      className={
        'border-b-line_regular flex h-[46px] w-full items-center justify-between border-b pr-3 pl-4'
      }
    >
      <CaptionLabel className={'flex items-center'}>
        <div
          className={
            'text-text1 hover:text-brand_blue mr-2 cursor-pointer text-[16px] font-medium transition-all duration-300'
          }
          onClick={() => setMode('year')}
        >
          {year}年
        </div>
        <div
          className={
            'text-text1 hover:text-brand_blue cursor-pointer text-[16px] font-medium transition-all duration-300'
          }
          onClick={() => setMode('month')}
        >
          {month}月
        </div>
      </CaptionLabel>
      <div className={'flex items-center'}>
        <PreviousMonthButton
          className={cn(
            'hover:bg-graph_bg_thin flex size-[30px] cursor-pointer items-center justify-center rounded-[8px] transition-all duration-300',
            isPrevDisabled && 'cursor-not-allowed'
          )}
          disabled={isPrevDisabled}
          onClick={() => {
            setMode('normal')
            goToMonth(previousMonth ?? new Date())
          }}
        >
          <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' width='16' height='16'>
            <path
              d='M10.363666666666667 1.9696666666666665C10.656533333333332 2.262563333333333 10.656533333333332 2.7374333333333336 10.363666666666667 3.0303333333333335L5.45291 7.941049999999999C5.420366666666666 7.973649999999999 5.420366666666666 8.02635 5.45291 8.05895L10.363666666666667 12.96968333333333C10.656533333333332 13.26255 10.656533333333332 13.737449999999999 10.363666666666667 14.030316666666668C10.070783333333331 14.3232 9.595883333333333 14.3232 9.303016666666666 14.030316666666668L4.392253333333334 9.119599999999998C3.7739233333333333 8.50125 3.7739233333333333 7.4987499999999985 4.392253333333334 6.8804L9.303016666666666 1.9696666666666665C9.595883333333333 1.6767766666666664 10.070783333333331 1.6767766666666664 10.363666666666667 1.9696666666666665z'
              fill='currentColor'
            ></path>
          </svg>
        </PreviousMonthButton>
        <div
          className={
            'text-text1 hover:text-brand_blue mx-2 cursor-pointer text-sm transition-all duration-300 select-none'
          }
          onClick={() => setMode('normal')}
        >
          {mode === 'normal' ? '今日' : mode === 'year' ? '今年' : '当月'}
        </div>
        <NextMonthButton
          className={cn(
            'hover:bg-graph_bg_thin flex size-[30px] cursor-pointer items-center justify-center rounded-[8px] transition-all duration-300',
            isNextDisabled && 'cursor-not-allowed'
          )}
          disabled={isNextDisabled}
          onClick={() => {
            setMode('normal')
            goToMonth(nextMonth ?? new Date())
          }}
        >
          <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' width='16' height='16'>
            <path
              d='M5.636343333333333 1.9696666666666665C5.343443333333333 2.262563333333333 5.343443333333333 2.7374333333333336 5.636343333333333 3.0303333333333335L10.547066666666668 7.941049999999999C10.579583333333332 7.973649999999999 10.579583333333332 8.02635 10.547066666666668 8.05895L5.636343333333333 12.96968333333333C5.343443333333333 13.26255 5.343443333333333 13.737449999999999 5.636343333333333 14.030316666666668C5.929229999999999 14.3232 6.4041066666666655 14.3232 6.696996666666665 14.030316666666668L11.607716666666665 9.119599999999998C12.226066666666664 8.50125 12.226066666666664 7.4987499999999985 11.607716666666665 6.8804L6.696996666666665 1.9696666666666665C6.4041066666666655 1.6767766666666664 5.929229999999999 1.6767766666666664 5.636343333333333 1.9696666666666665z'
              fill='currentColor'
            ></path>
          </svg>
        </NextMonthButton>
      </div>
    </div>
  )
}

export default DatePickerHeader
