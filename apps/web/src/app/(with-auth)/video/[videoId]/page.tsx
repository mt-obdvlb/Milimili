import VideoWrapper from '@/features/video/components/VideoWrapper'
import HeaderBarWrapper from '@/components/layout/header/header-bar/HeaderBarWrapper'
import { getVideoDetail } from '@/features'

const Video = async ({ params }: { params: Promise<{ videoId: string }> }) => {
  const { videoId } = await params
  const { videoDetail } = await getVideoDetail(videoId)
  return (
    <div className={'bg-bg1'}>
      <header className={'min-h-16'}>
        <HeaderBarWrapper isFixed />
      </header>
      {videoDetail ? (
        <VideoWrapper videoDetail={videoDetail} />
      ) : (
        <main className={'mx-auto text-text1 py-50'}>暂无内容</main>
      )}
    </div>
  )
}

export default Video
