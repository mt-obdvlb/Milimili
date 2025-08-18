import { videoList } from '@/services/video'

export const getVideoList = async () => {
  await import('server-only')
  const { data } = await videoList(1, 9)
  return {
    videoSwiperList: data?.list,
  }
}

export const useVideoList = () => {}
