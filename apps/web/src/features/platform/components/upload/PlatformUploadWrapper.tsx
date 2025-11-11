'use client'

import { cloneElement, useCallback, useEffect, useState } from 'react'
import { cn } from '@/lib'
import { Button, Input, Separator } from '@/components'
import PlatformUploadVideoDetail from '@/features/platform/components/upload/PlatformUploadVideoDetail'
import { useRouter, useSearchParams } from 'next/navigation'
import { useUploadFile, useVideoDetail } from '@/features'
import { useDropzone } from 'react-dropzone'
import { getVideoMeta } from '@/utils'
import { VideoCreateDTO } from '@mtobdvlb/shared-types'

const PlatformUploadWrapper = () => {
  const searchParams = useSearchParams()
  const videoId = searchParams.get('videoId')
  const { videoDetail } = useVideoDetail(videoId ?? '')
  const [video, setVideo] = useState<Partial<VideoCreateDTO> | null>(null)
  const { uploadFile } = useUploadFile()
  const [complete, setComplete] = useState(false)
  const router = useRouter()
  const { getInputProps, getRootProps, isDragActive } = useDropzone({
    accept: {
      'video/mp4': ['.mp4'],
      'video/quicktime': ['.mov'],
      'video/x-matroska': ['.mkv'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    maxFiles: 1,
    onDrop: useCallback(
      async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0]

        if (file) {
          const [{ thumbnail, time }, { fileUrl }] = await Promise.all([
            getVideoMeta(file),
            uploadFile(file),
          ])
          setVideo({
            thumbnail,
            time,
            url: fileUrl,
            title: file.name,
          })
        }
      },
      [uploadFile]
    ),
  })

  useEffect(() => {
    if (videoDetail) {
      const video = videoDetail.video
      setVideo({
        ...video,
      })
    }
  }, [videoDetail])

  if (video && !complete)
    return (
      <PlatformUploadVideoDetail
        setCompelete={setComplete}
        setVideo={setVideo}
        video={video}
        edit={!!videoId}
        videoId={videoId ?? undefined}
      />
    )

  return (
    <>
      <div className={'h-16 border-b border-b-line_regular'}>
        <span
          className={
            'text-[#00a1d6] font-bold border-b-4 border-b-brand_blue leading-16 pb-4.5 pt-[26px] ml-10 text-[16px]'
          }
        >
          视频投稿
        </span>
      </div>
      {!complete ? (
        <div className={'pt-2 pb-4 h-[calc(100%-64px)] overflow-auto '}>
          <div className={'max-w-[960px] mx-auto relative flex flex-col'}>
            <div className={'flex mt-6 mb-[50px]'}>
              {[
                {
                  icon: (
                    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48' fill='none'>
                      <g opacity='0.3' filter='url(#videoup-icon-video_size_filter0_i_2182_20369)'>
                        <rect
                          x='29.76'
                          y='2.39999'
                          width='21.12'
                          height='29.76'
                          rx='3.55325'
                          transform='rotate(30 29.76 2.39999)'
                          fill='url(#videoup-icon-video_size_paint0_linear_2182_20369)'
                        ></rect>
                      </g>
                      <foreignObject x='-8.52528' y='-1.17247' width='52.5702' height='55.625'>
                        <div
                          style={{
                            height: '100%',
                            width: '100%',
                          }}
                        />
                      </foreignObject>
                      <path
                        data-figma-bg-blur-radius='9.47532'
                        d='M3.62338 13.9343L23.6503 8.56811C25.4668 8.08159 27.3342 9.15956 27.8209 10.976L34.305 35.1751C34.7917 36.9915 33.7135 38.8588 31.8971 39.3457L11.8702 44.7119C10.0537 45.1986 8.18636 44.1205 7.69962 42.304L1.21549 18.1049C0.728747 16.2883 1.80683 14.421 3.62338 13.9343Z'
                        fill='url(#videoup-icon-video_size_paint1_linear_2182_20369)'
                        fillOpacity='0.5'
                        stroke='url(#videoup-icon-video_size_paint2_linear_2182_20369)'
                        strokeWidth='0.296104'
                      ></path>
                      <defs>
                        <filter
                          id='videoup-icon-video_size_filter0_i_2182_20369'
                          x='16.18'
                          y='3.69995'
                          width='30.5705'
                          height='33.733'
                          filterUnits='userSpaceOnUse'
                          colorInterpolationFilters='sRGB'
                        >
                          <feFlood floodOpacity='0' result='BackgroundImageFix'></feFlood>
                          <feBlend
                            mode='normal'
                            in='SourceGraphic'
                            in2='BackgroundImageFix'
                            result='shape'
                          ></feBlend>
                          <feColorMatrix
                            in='SourceAlpha'
                            type='matrix'
                            values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
                            result='hardAlpha'
                          ></feColorMatrix>
                          <feOffset></feOffset>
                          <feGaussianBlur stdDeviation='0.592208'></feGaussianBlur>
                          <feComposite
                            in2='hardAlpha'
                            operator='arithmetic'
                            k2='-1'
                            k3='1'
                          ></feComposite>
                          <feColorMatrix
                            type='matrix'
                            values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0'
                          ></feColorMatrix>
                          <feBlend
                            mode='normal'
                            in2='shape'
                            result='effect1_innerShadow_2182_20369'
                          ></feBlend>
                        </filter>
                        <clipPath
                          id='videoup-icon-video_size_bgblur_0_2182_20369_clip_path'
                          transform='translate(8.52528 1.17247)'
                        >
                          <path d='M3.62338 13.9343L23.6503 8.56811C25.4668 8.08159 27.3342 9.15956 27.8209 10.976L34.305 35.1751C34.7917 36.9915 33.7135 38.8588 31.8971 39.3457L11.8702 44.7119C10.0537 45.1986 8.18636 44.1205 7.69962 42.304L1.21549 18.1049C0.728747 16.2883 1.80683 14.421 3.62338 13.9343Z'></path>
                        </clipPath>
                        <linearGradient
                          id='videoup-icon-video_size_paint0_linear_2182_20369'
                          x1='29.76'
                          y1='32.16'
                          x2='57.8518'
                          y2='12.2239'
                          gradientUnits='userSpaceOnUse'
                        >
                          <stop stopColor='#0084FF'></stop>
                          <stop offset='1' stopColor='#E1EBFF'></stop>
                        </linearGradient>
                        <linearGradient
                          id='videoup-icon-video_size_paint1_linear_2182_20369'
                          x1='8.47596'
                          y1='45.7749'
                          x2='32.0885'
                          y2='10.9231'
                          gradientUnits='userSpaceOnUse'
                        >
                          <stop stopColor='white' stopOpacity='0'></stop>
                          <stop offset='1' stopColor='white'></stop>
                        </linearGradient>
                        <linearGradient
                          id='videoup-icon-video_size_paint2_linear_2182_20369'
                          x1='27.0437'
                          y1='7.50517'
                          x2='3.43116'
                          y2='42.3569'
                          gradientUnits='userSpaceOnUse'
                        >
                          <stop stopColor='white'></stop>
                          <stop offset='1' stopColor='white' stopOpacity='0'></stop>
                        </linearGradient>
                      </defs>
                    </svg>
                  ),
                  title: '视频大小',
                  desc: '视频大小10MB以内，时长5分钟以内',
                },
                {
                  title: '视频格式',
                  desc: '推荐上传 MP4/MOV/MKV 格式，转码更快～',
                  icon: (
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 48 48'
                      fill='none'
                      id='videoup-icon-video_format'
                    >
                      <g
                        opacity='0.3'
                        filter='url(#videoup-icon-video_format_filter0_i_2182_20380)'
                      >
                        <path
                          d='M27.5993 2.98628C28.6563 2.37597 29.9587 2.37597 31.0158 2.98628L41.1892 8.85987C42.2463 9.47019 42.8975 10.5981 42.8975 11.8187V23.5659C42.8975 24.7865 42.2463 25.9144 41.1892 26.5247L31.0158 32.3983C29.9587 33.0086 28.6563 33.0086 27.5993 32.3983L17.4259 26.5247C16.3688 25.9144 15.7176 24.7865 15.7176 23.5659V11.8187C15.7176 10.5981 16.3688 9.47018 17.4259 8.85987L27.5993 2.98628Z'
                          fill='url(#videoup-icon-video_format_paint0_linear_2182_20380)'
                        ></path>
                      </g>
                      <foreignObject x='-5.50084' y='5.81215' width='50.3955' height='47.0005'>
                        <div
                          style={{
                            height: '100%',
                            width: '100%',
                          }}
                        ></div>
                      </foreignObject>
                      <path
                        data-figma-bg-blur-radius='9.11089'
                        d='M26.0323 15.0654C27.202 15.0655 28.2832 15.6896 28.868 16.7026L35.2032 27.6751C35.788 28.6882 35.7875 29.9365 35.2026 30.9495L28.8677 41.922C28.2828 42.9349 27.2019 43.5595 26.0323 43.5596L13.3622 43.5595C12.1925 43.5595 11.1114 42.9353 10.5265 41.9223L4.19134 30.9497C3.60646 29.9367 3.60614 28.6879 4.19103 27.6749L10.526 16.7024C11.1109 15.6894 12.1925 15.0653 13.3622 15.0653L26.0323 15.0654Z'
                        fill='url(#videoup-icon-video_format_paint1_linear_2182_20380)'
                        fillOpacity='0.5'
                        stroke='url(#videoup-icon-video_format_paint2_linear_2182_20380)'
                        strokeWidth='0.284715'
                      ></path>
                      <defs>
                        <filter
                          id='videoup-icon-video_format_filter0_i_2182_20380'
                          x='15.7176'
                          y='2.52853'
                          width='27.1799'
                          height='30.3275'
                          filterUnits='userSpaceOnUse'
                          colorInterpolationFilters='sRGB'
                        >
                          <feFlood floodOpacity='0' result='BackgroundImageFix'></feFlood>
                          <feBlend
                            mode='normal'
                            in='SourceGraphic'
                            in2='BackgroundImageFix'
                            result='shape'
                          ></feBlend>
                          <feColorMatrix
                            in='SourceAlpha'
                            type='matrix'
                            values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
                            result='hardAlpha'
                          ></feColorMatrix>
                          <feOffset></feOffset>
                          <feGaussianBlur stdDeviation='0.569431'></feGaussianBlur>
                          <feComposite
                            in2='hardAlpha'
                            operator='arithmetic'
                            k2='-1'
                            k3='1'
                          ></feComposite>
                          <feColorMatrix
                            type='matrix'
                            values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0'
                          ></feColorMatrix>
                          <feBlend
                            mode='normal'
                            in2='shape'
                            result='effect1_innerShadow_2182_20380'
                          ></feBlend>
                        </filter>
                        <clipPath
                          id='videoup-icon-video_format_bgblur_0_2182_20380_clip_path'
                          transform='translate(5.50084 -5.81215)'
                        >
                          <path d='M26.0323 15.0654C27.202 15.0655 28.2832 15.6896 28.868 16.7026L35.2032 27.6751C35.788 28.6882 35.7875 29.9365 35.2026 30.9495L28.8677 41.922C28.2828 42.9349 27.2019 43.5595 26.0323 43.5596L13.3622 43.5595C12.1925 43.5595 11.1114 42.9353 10.5265 41.9223L4.19134 30.9497C3.60646 29.9367 3.60614 28.6879 4.19103 27.6749L10.526 16.7024C11.1109 15.6894 12.1925 15.0653 13.3622 15.0653L26.0323 15.0654Z'></path>
                        </clipPath>
                        <linearGradient
                          id='videoup-icon-video_format_paint0_linear_2182_20380'
                          x1='13.6152'
                          y1='33.3846'
                          x2='44.9998'
                          y2='2'
                          gradientUnits='userSpaceOnUse'
                        >
                          <stop stopColor='#0084FF'></stop>
                          <stop offset='1' stopColor='#E1EBFF'></stop>
                        </linearGradient>
                        <linearGradient
                          id='videoup-icon-video_format_paint1_linear_2182_20380'
                          x1='-3.00015'
                          y1='35.394'
                          x2='42.3939'
                          y2='23.2307'
                          gradientUnits='userSpaceOnUse'
                        >
                          <stop stopColor='white' stopOpacity='0'></stop>
                          <stop offset='1' stopColor='white'></stop>
                        </linearGradient>
                        <linearGradient
                          id='videoup-icon-video_format_paint2_linear_2182_20380'
                          x1='42.3939'
                          y1='23.2307'
                          x2='-3.00015'
                          y2='35.394'
                          gradientUnits='userSpaceOnUse'
                        >
                          <stop stopColor='white'></stop>
                          <stop offset='1' stopColor='white' stopOpacity='0'></stop>
                        </linearGradient>
                      </defs>
                    </svg>
                  ),
                },
                {
                  icon: (
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 48 48'
                      fill='none'
                      id='videoup-icon-video_resolution'
                    >
                      <g
                        opacity='0.3'
                        filter='url(#videoup-icon-video_resolution_filter0_i_2182_20391)'
                      >
                        <rect
                          x='18.5063'
                          y='3.026'
                          width='28.9935'
                          height='28.9935'
                          rx='3.7013'
                          fill='url(#videoup-icon-video_resolution_paint0_linear_2182_20391)'
                        ></rect>
                      </g>
                      <foreignObject x='-9.87013' y='1.79222' width='53.0519' height='53.052'>
                        <div
                          style={{
                            height: '100%',
                            width: '100%',
                          }}
                        ></div>
                      </foreignObject>
                      <path
                        data-figma-bg-blur-radius='9.87013'
                        d='M3.70117 11.8167H29.6104C31.5693 11.8167 33.1572 13.4046 33.1572 15.3635V41.2727C33.1572 43.2317 31.5694 44.8196 29.6104 44.8196H3.70117C1.74223 44.8195 0.154297 43.2317 0.154297 41.2727V15.3635C0.154366 13.4046 1.74228 11.8167 3.70117 11.8167Z'
                        fill='url(#videoup-icon-video_resolution_paint1_linear_2182_20391)'
                        fillOpacity='0.5'
                        stroke='url(#videoup-icon-video_resolution_paint2_linear_2182_20391)'
                        strokeWidth='0.308442'
                      ></path>
                      <defs>
                        <filter
                          id='videoup-icon-video_resolution_filter0_i_2182_20391'
                          x='18.5063'
                          y='3.026'
                          width='28.9935'
                          height='28.9935'
                          filterUnits='userSpaceOnUse'
                          colorInterpolationFilters='sRGB'
                        >
                          <feFlood floodOpacity='0' result='BackgroundImageFix'></feFlood>
                          <feBlend
                            mode='normal'
                            in='SourceGraphic'
                            in2='BackgroundImageFix'
                            result='shape'
                          ></feBlend>
                          <feColorMatrix
                            in='SourceAlpha'
                            type='matrix'
                            values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
                            result='hardAlpha'
                          ></feColorMatrix>
                          <feOffset></feOffset>
                          <feGaussianBlur stdDeviation='0.616883'></feGaussianBlur>
                          <feComposite
                            in2='hardAlpha'
                            operator='arithmetic'
                            k2='-1'
                            k3='1'
                          ></feComposite>
                          <feColorMatrix
                            type='matrix'
                            values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0'
                          ></feColorMatrix>
                          <feBlend
                            mode='normal'
                            in2='shape'
                            result='effect1_innerShadow_2182_20391'
                          ></feBlend>
                        </filter>
                        <clipPath
                          id='videoup-icon-video_resolution_bgblur_0_2182_20391_clip_path'
                          transform='translate(9.87013 -1.79222)'
                        >
                          <path d='M3.70117 11.8167H29.6104C31.5693 11.8167 33.1572 13.4046 33.1572 15.3635V41.2727C33.1572 43.2317 31.5694 44.8196 29.6104 44.8196H3.70117C1.74223 44.8195 0.154297 43.2317 0.154297 41.2727V15.3635C0.154366 13.4046 1.74228 11.8167 3.70117 11.8167Z'></path>
                        </clipPath>
                        <linearGradient
                          id='videoup-icon-video_resolution_paint0_linear_2182_20391'
                          x1='18.5063'
                          y1='32.0195'
                          x2='47.4999'
                          y2='3.026'
                          gradientUnits='userSpaceOnUse'
                        >
                          <stop stopColor='#0084FF'></stop>
                          <stop offset='1' stopColor='#E1EBFF'></stop>
                        </linearGradient>
                        <linearGradient
                          id='videoup-icon-video_resolution_paint1_linear_2182_20391'
                          x1='0'
                          y1='44.974'
                          x2='33.3117'
                          y2='11.6624'
                          gradientUnits='userSpaceOnUse'
                        >
                          <stop stopColor='white' stopOpacity='0'></stop>
                          <stop offset='1' stopColor='white'></stop>
                        </linearGradient>
                        <linearGradient
                          id='videoup-icon-video_resolution_paint2_linear_2182_20391'
                          x1='33.3117'
                          y1='11.6624'
                          x2='-1.98553e-06'
                          y2='44.974'
                          gradientUnits='userSpaceOnUse'
                        >
                          <stop stopColor='white'></stop>
                          <stop offset='1' stopColor='white' stopOpacity='0'></stop>
                        </linearGradient>
                      </defs>
                    </svg>
                  ),
                  title: '视频分辨率',
                  desc: '推荐分辨率：1080P 、4K ，高分辨率更清晰流畅～',
                },
              ].map((item, index) => (
                <div key={item.title} className={'flex'}>
                  <div className={'w-[278px] h-16 bg-white flex items-center'}>
                    <div className={'mr-5'}>
                      {cloneElement(item.icon, { className: cn('size-12') })}
                    </div>
                    <div className={'flex flex-col h-full justify-between'}>
                      <div className={'text-[16px] font-medium text-[#333]'}>{item.title}</div>
                      <div
                        className={'text-xs font-normal whitespace-pre-line text-text3 leading-4'}
                      >
                        {item.desc}
                      </div>
                    </div>
                  </div>
                  {index !== 2 && (
                    <Separator
                      orientation={'vertical'}
                      className={'h-[51px] w-[1px] bg-[#f1f2f3] my-[6.5px] mx-[21.5px]'}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className={'bg-[rgb(246,247,248)] mt-3 relative h-[425px] rounded-[8px]'}>
              <div
                {...getRootProps()}
                className={cn(
                  'relative cursor-pointer text-[#999] text-sm text-center size-full transition-colors duration-300 rounded-[8px]',
                  isDragActive && 'bg-[rgb(230,240,255)] border-2 border-dashed border-brand_blue'
                )}
              >
                <div className={cn('size-full')}>
                  <div className={cn('h-full flex flex-col items-center justify-center')}>
                    <svg
                      className={'w-30 h-[83px] text-[#999]'}
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 121 83'
                      fill='none'
                      id='videoup-icon-upload_icon_cloud'
                    >
                      <g opacity='0.1'>
                        <path
                          d='M64.6182 39.8799C63.017 37.8875 59.983 37.8875 58.3818 39.8799L44.2275 57.4941C42.1241 60.1118 43.9876 64 47.3457 64H51V83H21.7939C10.196 83 0.793945 73.598 0.793945 62C0.793945 52.0242 7.74993 43.6731 17.0762 41.5322C17.0253 40.8615 17 40.1838 17 39.5C17 24.8645 28.8645 13 43.5 13C43.9177 13 44.3331 13.0102 44.7461 13.0293C50.6 5.1225 59.9692 0.000148026 70.5293 0C88.2672 0 102.647 14.451 102.647 32.2773C102.647 32.6994 102.636 33.1199 102.62 33.5381C113.217 36.4758 121 46.2322 121 57.8164C121 71.7249 109.781 83 95.9414 83C95.5713 83 95.2031 82.9896 94.8369 82.9736C94.4914 82.9905 94.1437 83 93.7939 83H71V64H75.6543C79.0124 64 80.8759 60.1118 78.7725 57.4941L64.6182 39.8799Z'
                          fill='url(#videoup-icon-upload_icon_cloud_paint0_linear_2182_20411)'
                        ></path>
                        <path
                          d='M64.6182 39.8799C63.017 37.8875 59.983 37.8875 58.3818 39.8799L44.2275 57.4941C42.1241 60.1118 43.9876 64 47.3457 64H51V83H21.7939C10.196 83 0.793945 73.598 0.793945 62C0.793945 52.0242 7.74993 43.6731 17.0762 41.5322C17.0253 40.8615 17 40.1838 17 39.5C17 24.8645 28.8645 13 43.5 13C43.9177 13 44.3331 13.0102 44.7461 13.0293C50.6 5.1225 59.9692 0.000148026 70.5293 0C88.2672 0 102.647 14.451 102.647 32.2773C102.647 32.6994 102.636 33.1199 102.62 33.5381C113.217 36.4758 121 46.2322 121 57.8164C121 71.7249 109.781 83 95.9414 83C95.5713 83 95.2031 82.9896 94.8369 82.9736C94.4914 82.9905 94.1437 83 93.7939 83H71V64H75.6543C79.0124 64 80.8759 60.1118 78.7725 57.4941L64.6182 39.8799Z'
                          fill='#61666D'
                        ></path>
                      </g>
                      <defs>
                        <linearGradient
                          id='videoup-icon-upload_icon_cloud_paint0_linear_2182_20411'
                          x1='-10'
                          y1='79'
                          x2='140.5'
                          y2='79'
                          gradientUnits='userSpaceOnUse'
                        >
                          <stop stopColor='#F6F7F8'></stop>
                          <stop offset='0.537479' stopColor='#E3E5E7'></stop>
                          <stop offset='1' stopColor='#F6F7F8'></stop>
                        </linearGradient>
                      </defs>
                    </svg>
                    <span className={'mt-2.5 text-[#999] text-[13px]'}>
                      点击上传或将视频拖拽到此区域
                    </span>
                    <span
                      className={cn(
                        'bg-brand_blue text-white mt-6 w-[304px] rounded-[6px] transition-colors duration-300 ease-in-out text-center leading-12 whitespace-nowrap'
                      )}
                    >
                      上传视频
                    </span>
                  </div>
                  <Input {...getInputProps()} className={cn('size-0 opacity-0')} />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={'h-[calc(100%-65px)]'}>
          <div
            className={cn(
              "w-[366px] h-[207px] bg-no-repeat my-[30px] mx-auto  bg-center bg-[size:100%_100%] bg-[url('/images/upload-success.png')]"
            )}
          ></div>
          <div className={cn('mt-4 text-center text-[24px] font-bold text-black/85 leading-8')}>
            稿件投递成功
          </div>
          <div className={cn('mt-[82px] text-center flex justify-center mb-[50px] text-sm')}>
            <Button
              className={cn(
                ' leading-[1] relative select-none mr-2.5 rounded-[4px] cursor-pointer text-center inline-block border border-line_regular bg-white text-[#505050] text-[16px] px-4 py-2.5 w-[140px]'
              )}
              onClick={() => {
                router.push('/platform/upload-manager')
              }}
            >
              查看稿件
            </Button>
            <Button
              className={cn(
                ' leading-[1] relative select-none rounded-[4px] cursor-pointer text-center inline-block border border-line_regular bg-brand_blue text-white text-[16px] px-4 py-2.5 w-[140px]'
              )}
              onClick={() => {
                setComplete(false)
                router.push('/platform/upload')
                setVideo(null)
              }}
            >
              继续投稿
            </Button>
          </div>
        </div>
      )}
    </>
  )
}

export default PlatformUploadWrapper
