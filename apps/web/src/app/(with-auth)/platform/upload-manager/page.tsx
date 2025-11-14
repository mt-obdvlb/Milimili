import PlatformUploadManagerWrapper from '@/features/platform/components/upload-manager/PlatformUploadManagerWrapper'

const PlatformUploadManager = () => {
  return (
    <main className={'w-[inherit] mx-[72px] h-full bg-white flow-root pb-5 mt-4'}>
      <div className={'relative '}>
        <div className={'bg-white h-16 border-b border-b-line_regular relative flex'}>
          <div
            className={
              'text-brand_blue border-b-3 select-none border-b-brand_blue font-bold flex pt-[26px] h-full ml-10 text-[16px] tracking-[0.5px] leading-5 relative'
            }
          >
            <span>视频投稿</span>
          </div>
        </div>
      </div>
      <div className={'px-10 pb-5 relative'}>
        <PlatformUploadManagerWrapper />
      </div>
    </main>
  )
}

export default PlatformUploadManager
