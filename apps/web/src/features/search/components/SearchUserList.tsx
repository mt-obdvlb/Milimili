import { SearchGetItem } from '@mtobdvlb/shared-types'
import { Dispatch, SetStateAction } from 'react'
import SearchUserItem from '@/features/search/components/SearchUserItem'
import SearchPagination from '@/features/search/components/SearchPagination'

const SearchUserList = ({
  searchList,
  total,
  page,
  setPage,
}: {
  searchList?: SearchGetItem[]
  total: number
  page: number
  setPage: Dispatch<SetStateAction<number>>
}) => {
  return (
    <div className={'min-h-[calc(100vh-652px)] px-16 pb-[30px]'}>
      <div className={'-mx-[calc(16px*0.5)] mt-10 flex flex-wrap'}>
        {searchList?.map((item, index) => (
          <SearchUserItem user={item.user} key={index} />
        ))}
      </div>
      <SearchPagination page={page} setPage={setPage} total={total} pageSize={22} />
    </div>
  )
}

export default SearchUserList
