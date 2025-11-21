import {
  FavoriteFolderList,
  FavoriteFolderListItem,
  FavoriteFolderUpdateDTO,
  FavoriteListDTO,
  FavoriteListItem,
  FavoriteRecentList,
  PageResult,
  Result,
} from '@mtobdvlb/shared-types'
import request from '@/lib/request'
import {
  FavoriteAddBatchRequest,
  FavoriteDeleteBatchRequest,
  FavoriteFolderAddRequest,
  FavoriteMoveBatchRequest,
} from '@/types'

const baseURL = '/favorites'

const API = {
  recent: '/recent',
  folderList: '/folder',
  deleteBatch: '/',
  addBatch: '/batch',
  moveBatch: '/move-batch',
  cleanWatchLater: '/clean-watch-later',
  folderAdd: '/folder',
  videoId: '/videoId',
  detail: '/detail',
  list: '',
  deleteFolder: '/folder',
  updateFolder: '/folder',
  watchLaterToggle: '/watch-later',
} as const

export const favoriteGetRecent = () =>
  request.get<Result<FavoriteRecentList>>(`${baseURL}${API.recent}`)

export const favoriteGetFolderList = (userId?: string) =>
  request.get<Result<FavoriteFolderList>>(`${baseURL}${API.folderList}/${userId ?? ''}`)

export const favoriteDeleteBatch = (body: FavoriteDeleteBatchRequest) =>
  request.delete<Result>(`${baseURL}${API.deleteBatch}`, { data: body })

export const favoriteAddBatch = (body: FavoriteAddBatchRequest) =>
  request.post<Result>(`${baseURL}${API.addBatch}`, body)

export const favoriteMoveBatch = (body: FavoriteMoveBatchRequest) =>
  request.post<Result>(`${baseURL}${API.moveBatch}`, body)

export const favoriteCleanWatchLater = () =>
  request.post<Result>(`${baseURL}${API.cleanWatchLater}`)

export const favoriteAddFolder = (body: FavoriteFolderAddRequest) =>
  request.post<Result>(`${baseURL}${API.folderAdd}`, body)

export const favoriteGetByVideoId = (videoId: string) =>
  request.get<Result>(`${baseURL}${API.videoId}/${videoId}`)

export const favoriteGetDetail = (id: string) =>
  request.get<Result<FavoriteFolderListItem>>(`${baseURL}${API.detail}/${id}`)

export const favoriteList = (params: FavoriteListDTO) =>
  request.get<Result<PageResult<FavoriteListItem>>>(`${baseURL}${API.list}`, { params })

export const favoriteDeleteFolder = (id: string) =>
  request.delete<Result>(`${baseURL}${API.deleteFolder}/${id}`)

export const favoriteUpdateFolder = ({ id, body }: { id: string; body: FavoriteFolderUpdateDTO }) =>
  request.put<Result>(`${baseURL}${API.updateFolder}/${id}`, body)

export const favoriteToggleWatchLater = (videoId: string) =>
  request.put<Result>(`${baseURL}${API.watchLaterToggle}/${videoId}`)
