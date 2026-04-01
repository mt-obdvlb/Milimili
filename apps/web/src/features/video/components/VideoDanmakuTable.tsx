'use client'

import { useDanmakuGet } from '@/features'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatTime } from '@/utils'
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { cn, toast } from '@/lib'
import VideoDanmakuScrollbar from './VideoDanmakuScrollbar'
import { useVirtualizer } from '@tanstack/react-virtual'
import { OverlayScrollbarsComponentRef } from 'overlayscrollbars-react'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
import { useCopyToClipboard } from 'react-use'

type DanmakuItem = {
  id: string
  time: number
  content: string
}

const VideoDanmakuTable = ({ videoId }: { videoId: string }) => {
  const { danmakuList } = useDanmakuGet(videoId)

  const [sort, setSort] = useState<boolean | null>(null)

  const [selectId, setSelectId] = useState('')

  const [value, copy] = useCopyToClipboard()

  const parentRef = useRef<OverlayScrollbarsComponentRef>(null)

  const columns: ColumnDef<DanmakuItem>[] = [
    {
      accessorKey: 'time',
      header: () => (
        <TableHead
          onClick={() => setSort(!sort)}
          className={
            'text-[#6d757a] shrink-0 font-normal cursor-pointer text-xs h-8 leading-8  relative px-1.5 pl-4 pr-0 text-left w-15 '
          }
        >
          时间
          {sort !== null && (
            <span
              className={
                ' size-[10px] flex items-center justify-center absolute top-[11px] right-[5px] leading-0'
              }
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className={cn(!sort && 'rotate-180')}
                viewBox='0 0 10 6'
              >
                <path
                  fill='#999'
                  fillRule='nonzero'
                  d='M4.978 4.79.83.68a.486.486 0 0 0-.69.015.506.506 0 0 0 .01.707l4.515 4.472c.193.191.474.153.666-.037l4.52-4.478A.506.506 0 0 0 9.86.65a.486.486 0 0 0-.689-.015L4.978 4.79Z'
                ></path>
              </svg>
            </span>
          )}
        </TableHead>
      ),
      cell: (info) => (
        <TableCell className={' px-1.5 pl-4 relative text-left w-[66px] overflow-hidden'}>
          {formatTime(info.getValue() as number)}
        </TableCell>
      ),
      enableSorting: true,
    },
    {
      accessorKey: 'content',
      header: () => (
        <TableHead
          className={
            'text-[#6d757a]  font-normal cursor-pointer text-xs h-8 leading-8  relative px-1.5 text-left flex-1 '
          }
        >
          弹幕内容
        </TableHead>
      ),

      cell: (info) => (
        <TableCell className={'text-[#222] px-1.5 text-ellipsis whitespace-nowrap '}>
          {info.getValue() as string}
        </TableCell>
      ),
    },
  ]

  const sortedDanmaku = useMemo(() => {
    const list = [...danmakuList]
    if (sort === null) return list
    return list.sort((a, b) => (sort ? a.time - b.time : b.time - a.time))
  }, [danmakuList, sort])

  const table = useReactTable({
    data: sortedDanmaku,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const rowVirtualizer = useVirtualizer({
    count: sortedDanmaku.length,
    getScrollElement: () => parentRef.current?.osInstance()?.elements().viewport ?? null,
    estimateSize: () => 24, // 每行高度，可根据实际调整
    overscan: 5, // 多渲染几行，避免滚动空白
  })

  const virtualRows = rowVirtualizer.getVirtualItems()

  useEffect(() => {
    if (value.value) {
      toast('已复制')
    }
  }, [value.value])

  return (
    <div className='max-h-[376px] relative overflow-hidden '>
      {/* 表头 */}
      <Table className='w-full'>
        <TableHeader className=''>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow className={'flex'} key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Fragment key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </Fragment>
              ))}
            </TableRow>
          ))}
        </TableHeader>
      </Table>

      {/* 表体滚动 */}
      <VideoDanmakuScrollbar ref={parentRef}>
        <Table className='w-full'>
          <TableBody style={{ position: 'relative', height: rowVirtualizer.getTotalSize() }}>
            {virtualRows.map((virtualRow) => {
              const row = table.getRowModel().rows[virtualRow.index]
              if (!row) return null
              return (
                <ContextMenu key={row.id}>
                  <ContextMenuTrigger asChild>
                    <TableRow
                      style={{
                        position: 'absolute',
                        top: virtualRow.start, // 直接用top定位，避免transform
                        left: 0,
                        width: '100%',
                        height: virtualRow.size, // 显式指定行高，避免布局抖动
                      }}
                      onClick={() => setSelectId(row.id)}
                      className={cn(
                        'text-[#6d757a] cursor-pointer flex text-xs font-normal h-6 leading-6 relative select-none',
                        selectId === row.id && 'bg-[#9499a0]/10'
                      )}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <Fragment key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </Fragment>
                      ))}
                    </TableRow>
                  </ContextMenuTrigger>
                  <ContextMenuContent
                    className={
                      'bg-white border-line_regular shadow-[0_2px_4px_0] shadow-black/14 border text-shadow-[0_0_#e2e2e2] rounded-[4px] z-80 transition duration-100 outline-none'
                    }
                  >
                    <ContextMenuItem
                      onClick={() => {
                        copy(row.original.content)
                      }}
                      className={
                        'whitespace-nowrap text-ellipsis text-left py-1 px-5 leading-[30px] h-[30px] text-[12px] bg-transparent relative text-[#222] hover:bg-[#ddd] cursor-pointer'
                      }
                    >
                      复制选中弹幕
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              )
            })}
          </TableBody>
        </Table>
      </VideoDanmakuScrollbar>
    </div>
  )
}

export default VideoDanmakuTable
