'use client'

import * as React from 'react'
import { Dispatch, SetStateAction } from 'react'
import {
  DateRange,
  Day,
  DayButton,
  DayPicker,
  DayProps,
  getDefaultClassNames,
} from 'react-day-picker'
import { zhCN } from 'react-day-picker/locale'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { DatePickerSelectMode } from '@/components'

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = 'label',
  formatters,
  components,
  selectMode,
  setHoverDate,
  range,
  hoverDate,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>['variant']
} & {
  selectMode: DatePickerSelectMode
  setHoverDate: Dispatch<SetStateAction<Date | undefined>>
  range?: DateRange
  hoverDate?: Date
}) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      locale={zhCN}
      showOutsideDays={showOutsideDays}
      className={cn(
        'bg-background group/calendar p-3 [--cell-size:--spacing(8)] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent',
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) => date.toLocaleString('zh-cn', { month: 'short' }),
        ...formatters,
      }}
      modifiersClassNames={{
        hoverRange: cn(''),
        hoverEnd: cn(''),
      }}
      classNames={{
        root: cn('w-fit'),
        months: cn('relative'),
        month: cn('p-4'),
        month_grid: cn('size-full flex flex-col'),
        table: cn('block size-full'),
        weekdays: cn(
          'flex justify-between relative items-center text-[#212121] whitespace-nowrap font-bold'
        ),
        weekday: cn('grow-0 flex justify-center items-center text-text4 size-[30px]'),
        week: cn('flex items-center justify-center text-sm ', defaultClassNames.week),

        day: cn('   rounded-l-[8px] cursor-pointer text-text1'),
        range_start: cn('rounded-l-[8px] bg-brand_blue_thin'),
        range_middle: cn('rounded-l-none  bg-brand_blue_thin'),
        range_end: cn(''),
        today: cn(''),
        outside: cn('text-text2 '),
        disabled: cn('cursor-not-allowed text-text4', defaultClassNames.disabled),
        hidden: cn('invisible', defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return <div data-slot='calendar' ref={rootRef} className={cn(className)} {...props} />
        },
        Day: ({ ...props }) => (
          <CalendarDay
            selectMode={selectMode}
            range={range}
            setHoverDate={setHoverDate}
            hoverDate={hoverDate}
            {...props}
          />
        ),
        DayButton: ({ ...props }) => (
          <CalendarDayButton hoverDate={hoverDate} {...props} selectMode={selectMode} />
        ),
        ...components,
      }}
      {...props}
    />
  )
}

const CalendarDay = ({
  day,
  modifiers,
  children,
  setHoverDate,
  range,
  selectMode,
  className,
  hoverDate,
  ...props
}: DayProps & {
  setHoverDate: Dispatch<SetStateAction<Date | undefined>>
  selectMode: DatePickerSelectMode
  range?: DateRange
  hoverDate?: Date
}) => {
  if (!day) return null

  const dateTime = day.date.getTime()
  const fromTime = range?.from?.getTime()
  const toTime = range?.to?.getTime()

  // 基准点：normal/end 用 from，start 用 to
  const baseTime = selectMode === 'start' ? toTime : fromTime
  const hoverTs = hoverDate?.getTime()

  const isLeft = baseTime !== undefined && hoverTs !== undefined && hoverTs < baseTime
  const isRight = baseTime !== undefined && hoverTs !== undefined && hoverTs > baseTime

  // 只选择了一个点
  const selectedSingle =
    modifiers.selected && !modifiers.range_start && !modifiers.range_end && !modifiers.range_middle

  const isHoverRightOfSelectedSingle = selectedSingle && hoverTs !== undefined && hoverTs > dateTime

  const isEndPoint = modifiers.range_start || modifiers.range_end

  const handleMouseEnter = () => {
    if (modifiers.disabled) {
      setHoverDate(undefined)
      return
    }
    if (selectMode === 'normal' && fromTime && !toTime) setHoverDate(day.date)
    if (selectMode === 'start' && toTime) setHoverDate(day.date)
    if (selectMode === 'end' && fromTime) setHoverDate(day.date)
  }

  const handleMouseLeave = () => setHoverDate(undefined)

  return (
    <Day
      day={day}
      className={cn('group w-full cursor-pointer pt-2 last-of-type:w-fit')}
      modifiers={modifiers}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={cn(
          className,

          // hover 范围的底色
          modifiers.hoverRange && 'bg-brand_blue_thin rounded-none',

          // hover 端点的左右圆角
          modifiers.hoverEnd && isLeft && 'rounded-l-[8px] rounded-r-none',
          modifiers.hoverEnd && isRight && 'rounded-l-none rounded-r-[8px]',
          modifiers.hoverEnd && !selectedSingle && 'bg-brand_blue_thin text-brand_blue',
          // 单选情况下，hover 在右侧
          isHoverRightOfSelectedSingle && 'bg-brand_blue_thin rounded-l-[8px] rounded-r-none',
          isEndPoint && modifiers.hoverEnd && 'bg-inherit',
          hoverDate && !modifiers.hoverRange && 'bg-inherit',
          hoverDate && modifiers.hoverEnd && !isEndPoint && 'text-brand_blue bg-brand_blue_thin',
          hoverDate &&
            isLeft &&
            modifiers.range_start &&
            hoverDate.getTime() === day.date.getTime() &&
            'bg-brand_blue_thin',
          hoverDate && modifiers.range_start && selectMode === 'end' && 'bg-brand_blue_thin',
          modifiers.range_start && modifiers.range_end && 'bg-inherit'
        )}
        {...props}
      >
        {children}
      </div>
    </Day>
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  disabled,
  selectMode,
  hoverDate,
  ...props
}: React.ComponentProps<typeof DayButton> & {
  selectMode: DatePickerSelectMode
  hoverDate?: Date
}) {
  const ref = React.useRef<HTMLButtonElement>(null)

  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  const selectedSingle =
    modifiers.selected && !modifiers.range_start && !modifiers.range_end && !modifiers.range_middle

  return (
    <Button
      ref={ref}
      data-day={day.date.toLocaleDateString()}
      data-selected-single={selectedSingle}
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      disabled={disabled}
      className={cn(
        'border-brand_blue flex size-[30px] items-center justify-center rounded-[8px] transition-all duration-300',

        // hover 状态（非选中/禁用）
        !modifiers.selected &&
          !modifiers.hoverEnd &&
          !modifiers.disabled &&
          'group-hover:text-brand_blue group-hover:bg-brand_blue_thin',

        // 单选
        selectedSingle && 'bg-brand_blue text-white',

        // 范围
        modifiers.range_start && 'bg-brand_blue rounded-l-[8px] text-white',
        modifiers.range_end && 'bg-brand_blue rounded-r-[8px] text-white',
        modifiers.range_start &&
          selectMode === 'end' &&
          hoverDate?.getTime() !== day.date.getTime() &&
          'opacity-50',
        modifiers.range_end &&
          selectMode === 'start' &&
          hoverDate?.getTime() !== day.date.getTime() &&
          'opacity-50',
        // today
        modifiers.today && 'border',
        modifiers.range_start && modifiers.range_end && 'opacity-100',
        // 禁用
        modifiers.disabled && 'text-text4',

        className
      )}
      {...props}
    />
  )
}

export { Calendar, CalendarDayButton }
