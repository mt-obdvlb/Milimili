import PlatformUploadWrapper from '@/features/platform/components/upload/PlatformUploadWrapper'

const PlatformUpload = () => {
  return (
    <main
      className={
        'h-full min-w-[1000px] max-w-[1100px] mx-auto bg-white  bg-clip-padding border-t border-t-transparent '
      }
    >
      <PlatformUploadWrapper />
    </main>
  )
}

export default PlatformUpload
