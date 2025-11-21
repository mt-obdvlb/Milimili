import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { commentCreate, commentDelete, commentList as commentListApi } from '@/services/comment'
import { CommentGetDTO } from '@mtobdvlb/shared-types'

export const useComment = () => {
  const queryClient = useQueryClient()
  const { mutateAsync: comment } = useMutation({
    mutationFn: commentCreate,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['comment', 'list'],
      })
    },
  })
  return { comment }
}

export const useInfiniteCommentList = ({
  commentId,
  videoId,
  feedId,
  sort,
}: Pick<CommentGetDTO, 'videoId' | 'feedId' | 'sort' | 'commentId'>) => {
  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: [
      'comment',
      'list',
      {
        videoId,
        feedId,
        commentId,
      },
      sort,
    ],
    queryFn: ({ pageParam = 1 }) =>
      commentListApi({
        videoId,
        commentId,
        sort,
        feedId,
        page: pageParam,
        pageSize: 10,
      }),
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
    total: data?.pages[0]?.data?.total ?? 0,
  }
}

export const usePageCommentList = ({
  page,
  enabled = true,
  sort,
  ...props
}: Pick<CommentGetDTO, 'videoId' | 'feedId' | 'sort' | 'commentId' | 'page'> & {
  enabled?: boolean
}) => {
  const { data: commmentList } = useQuery({
    queryKey: ['comment', 'list', props, sort, page],
    queryFn: () =>
      commentListApi({
        ...props,
        sort,
        page,
        pageSize: 10,
      }),
    enabled,
  })
  return {
    commentList: commmentList?.data?.list ?? [],
    total: commmentList?.data?.total ?? 0,
  }
}

export const useCommentDelete = () => {
  const queryClient = useQueryClient()
  const { mutateAsync: deleteComment } = useMutation({
    mutationFn: (id: string) => commentDelete(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['comment', 'list'],
      })
    },
  })
  return { deleteComment }
}
