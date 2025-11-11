'use client'
import { VideoCreateDTO } from '@mtobdvlb/shared-types'
import { useUploadFile } from '@/features'
import { Input, Label } from '@/components'
import { Dispatch, SetStateAction } from 'react'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib'
import { getVideoMeta } from '@/utils'
import PlatformUploadVideoForm from '@/features/platform/components/upload/PlatformUploadVideoForm'

const PlatformUploadVideoDetail = ({
  video,
  videoId,
  edit,
  setVideo,
  setCompelete,
}: {
  edit: boolean
  video: Partial<VideoCreateDTO>
  videoId?: string
  setVideo: Dispatch<SetStateAction<Partial<VideoCreateDTO> | null>>
  setCompelete: Dispatch<SetStateAction<boolean>>
}) => {
  const { uploadFile, progress, isUploading } = useUploadFile()

  return (
    <div className={'relative flow-root min-h-full mb-[50px]'}>
      <div className={'bg-white'}>
        <div>
          <div
            className={
              'px-8 relative text-[16px] border-b border-b-line_regular font-semibold text-text1 leading-7 h-10 shadow-[0_1px_0_#e7e7e7] flex justify-between items-center'
            }
          >
            <span>{edit ? '编辑视频' : '上传视频'}</span>
          </div>
          <div
            className={cn(
              'mt-[23px] mx-8 font-normal text-xs leading-[17px] text-text1 relative',
              !edit && 'bg-[#f6f7f8] py-5 px-3'
            )}
          >
            {!edit && (
              <div
                className={
                  'absolute -top-5 left-[25px] size-0 border-10 border-transparent border-b-[#f6f7f8]'
                }
              ></div>
            )}
            <div className={'h-[82px] transition duration-500 ease-in-out overflow-hidden'}>
              <div className={'mb-1.5'}>
                <div className={'flex items-center w-[838px] h-[76px]'}>
                  <div
                    className={
                      "mr-3 w-[30px] h-[38px]  bg-[url('/images/upload-file-2.png')] bg-cover  bg-no-repeat "
                    }
                  ></div>
                  <div className={'w-[838px]'}>
                    <div className={'flex justify-between'}>
                      <div
                        className={
                          'font-normal text-[13px] leading-4.5 text-text1 w-full text-ellipsis overflow-hidden mr-2.5'
                        }
                      >
                        <div
                          className={
                            'max-w-[645px] whitespace-nowrap overflow-hidden text-ellipsis'
                          }
                        >
                          <div className={'p-1.5 pr-0 text-[#222] flex'}>
                            <div
                              className={
                                'max-w-[650px] whitespace-nowrap overflow-hidden text-ellipsis'
                              }
                            >
                              {video.title}
                            </div>
                          </div>
                        </div>
                        <div className={'flex items-center ml-1.5'}>
                          <div
                            className={
                              'flex-1 text-[10px] leading-[14px] text-[#999] flex items-center'
                            }
                          >
                            {isUploading ? (
                              <span>正在上传</span>
                            ) : (
                              <>
                                <svg
                                  xmlns='http://www.w3.org/2000/svg'
                                  viewBox='0 0 1024 1024'
                                  className={'size-[14px] mr-2 text-[rgb(67,206,91)] fill-current'}
                                >
                                  <defs>
                                    <style type='text/css'></style>
                                  </defs>
                                  <path
                                    d='M512 0C228.266667 0 0 228.266667 0 512s228.266667 512 512 512 512-228.266667 512-512S795.733333 0 512 0z m200.533333 418.133333L460.8 669.866667c-8.533333 8.533333-21.333333 12.8-34.133333 12.8-12.8 0-25.6-4.266667-34.133334-12.8l-81.066666-81.066667c-17.066667-21.333333-17.066667-46.933333 0-64 17.066667-17.066667 46.933333-17.066667 64 0L426.666667 576l221.866666-221.866667c17.066667-17.066667 46.933333-17.066667 64 0 17.066667 17.066667 17.066667 46.933333 0 64z'
                                    p-id='13337'
                                  ></path>
                                </svg>
                                <span>上传完成</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className={'flex items-center mt-2.5'}>
                        <Label
                          className={
                            'inline-flex items-center text-brand_blue text-sm cursor-pointer mr-2.5'
                          }
                        >
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            viewBox='0 0 20 20'
                            fill='none'
                            className={'size-[22px] mr-2'}
                          >
                            <circle cx='10' cy='10' r='10' fill='#00A1D6'></circle>
                            <path
                              d='M14.2326 12.663C14.7187 11.892 15 10.9788 15 10C15 7.23858 12.7614 5 10 5C7.23858 5 5 7.23858 5 10C5 12.7614 7.23858 15 10 15'
                              stroke='white'
                              strokeWidth='2'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                            ></path>
                            <path
                              d='M16.291 12.5409L14.126 13.7909L12.876 11.6259'
                              stroke='white'
                              strokeWidth='2'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                            ></path>
                          </svg>
                          <span className={'whitespace-nowrap'}>更换视频</span>
                          <Input
                            accept={'video/*'}
                            onChange={async (e) => {
                              const file = e.target.files?.[0]
                              if (!file) return
                              const [{ fileUrl }, { thumbnail, time }] = await Promise.all([
                                uploadFile(file),
                                getVideoMeta(file),
                              ])
                              setVideo((prev) => ({
                                ...prev,
                                url: fileUrl,
                                thumbnail,
                                time,
                                title: file.name,
                              }))
                            }}
                            className={'size-0 opacity-0'}
                            type={'file'}
                          />
                        </Label>
                      </div>
                    </div>
                    <div
                      className={
                        'mt-1.5 ml-1.5 h-[3px] w-[calc(100%-6px)] bg-[#e7e7e7] rounded-[6px]'
                      }
                    >
                      <Progress
                        value={isUploading ? progress : 100}
                        className={cn(
                          'size-full rounded-[6px] transition-all duration-300 ease-in-out bg-transparent'
                        )}
                        inlineClassName={cn(
                          'duration-300 ease-in-out',
                          isUploading ? 'bg-[#00a1d6]' : 'bg-[#43ce5b] '
                        )}
                      ></Progress>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <PlatformUploadVideoForm
          setCompelete={setCompelete}
          setVideo={setVideo}
          video={video}
          edit={edit}
          videoId={videoId}
        />
      </div>
    </div>
  )
}

export default PlatformUploadVideoDetail
