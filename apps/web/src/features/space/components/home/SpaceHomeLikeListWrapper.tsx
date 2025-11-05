import SpaceHomeHeader from '@/features/space/components/home/SpaceHomeHeader'

const SpaceHomeLikeListWrapper = () => {
  return (
    <div className={'pb-[24px] mb-[24px] border-b border-b-line_regular'}>
      <SpaceHomeHeader title={'最近点赞的视频'} isLink={false} />
      <div className={'grid grid-cols-5 gap-x-4 gap-y-5'}></div>
    </div>
  )
}

export default SpaceHomeLikeListWrapper
