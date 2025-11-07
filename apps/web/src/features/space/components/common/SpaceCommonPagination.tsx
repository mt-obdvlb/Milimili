import SearchPagination from '@/features/search/components/SearchPagination'
import { Input } from '@/components'
import { Dispatch, SetStateAction } from 'react'

const SpaceCommonPagination = ({
  page,
  setPage,
  total,
}: {
  page: number
  setPage: Dispatch<SetStateAction<number>>
  total: number
}) => {
  return (
    <div className={'w-fit mx-auto flex justify-start items-center whitespace-nowrap'}>
      <div className={'mr-11 flex items-center justify-start'}>
        <SearchPagination page={page} setPage={setPage} total={total} pageSize={50} />
      </div>
      <div className={'text-text1 flex items-center text-5'}>
        <span className={'mr-2'}>{`共 ${Math.ceil(total / 50)} 页 / ${total} 个，跳至`}</span>
        <div
          className={
            'w-[50px] overflow-hidden inline-flex grow relative bg-bg1 border border-line_regular text-4 rounded-md px-sm'
          }
        >
          <Input
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const page = Number(e.currentTarget.value)
                if (page < 1 || page > Math.ceil(total / 50)) {
                  e.currentTarget.value = ''
                  return
                }
                setPage(page)
                e.currentTarget.blur()
                e.currentTarget.value = ''
              }
            }}
            className={'h-8 leading-[1.5] text-text1 w-full text-4'}
          />
        </div>
        <span className={'ml-2'}>页</span>
      </div>
    </div>
  )
}

export default SpaceCommonPagination
