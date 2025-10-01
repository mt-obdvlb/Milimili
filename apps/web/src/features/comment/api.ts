import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { commentCreate, commentDelete, commentList as commentListApi } from '@/services/comment'
import { CommentGetDTO } from '@mtobdvlb/shared-types'
import _ from 'lodash'

const cleanObj = (obj: Record<string, string>) =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined))

export const useComment = (props: Pick<CommentGetDTO, 'videoId' | 'feedId' | 'commentId'>) => {
  const queryClient = useQueryClient()
  const params = cleanObj(props)
  const { mutateAsync: comment } = useMutation({
    mutationFn: commentCreate,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === 'commentList' && _.isEqual(query.queryKey[1], params),
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
    queryKey: ['commentList', { videoId, feedId, commentId }, sort],
    queryFn: ({ pageParam = 1 }) =>
      commentListApi({ videoId, commentId, sort, feedId, page: pageParam, pageSize: 10 }),
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
  const params = cleanObj(props)
  const { data: commmentList } = useQuery({
    queryKey: ['commentList', params, sort, page],
    queryFn: () => commentListApi({ ...params, sort, page, pageSize: 10 }),
    enabled,
  })
  return {
    commentList: commmentList?.data?.list ?? [],
    total: commmentList?.data?.total ?? 0,
  }
}

export const useCommentDelete = ({
  ...props
}: Pick<CommentGetDTO, 'videoId' | 'feedId' | 'commentId'>) => {
  const params = cleanObj(props)
  const queryClient = useQueryClient()
  const { mutateAsync: deleteComment } = useMutation({
    mutationFn: (id: string) => commentDelete(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === 'commentList' && _.isEqual(query.queryKey[1], params),
      })
    },
  })
  return { deleteComment }
}
