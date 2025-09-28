import { useInfiniteQuery, useMutation } from '@tanstack/react-query'
import { commentCreate, commentList as commentListApi } from '@/services/comment'
import { CommentGetDTO } from '@mtobdvlb/shared-types'

export const useComment = () => {
  const { mutateAsync: comment } = useMutation({
    mutationFn: commentCreate,
  })
  return { comment }
}

export const useCommentList = (params: CommentGetDTO) => {
  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ['commentList', params],
    queryFn: ({ pageParam = 1 }) => commentListApi({ ...params, page: pageParam }),
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce((sum, page) => sum + (page.data?.list.length ?? 0), 0)
      if (loaded < (lastPage.data?.total ?? 0)) {
        return allPages.length + 1
      }
      return undefined
    },
    initialPageParam: 1,
  })
  return {
    commentList: data?.pages.flatMap((page) => page.data?.list ?? []) ?? [],
    fetchNextPage,
    hasNextPage,
  }
}
