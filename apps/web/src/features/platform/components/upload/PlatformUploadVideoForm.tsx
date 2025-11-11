'use client'

import { AtTextareaRef, Button, Form, FormField, FormItem, Input, Label } from '@/components'
import { VideoCreateDTO, videoCreateDTO } from '@mtobdvlb/shared-types'
import { useCategoryList, useUploadFile, useVideoCreateUpdate } from '@/features'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dispatch, SetStateAction, useRef } from 'react'
import { tv } from 'tailwind-variants'
import { cn } from '@/lib'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import AtTextarea from '@/components/layout/at/AtTextarea'
import AtTextareaPlaceholder from '@/components/layout/at/AtTextareaPlaceholder'
import { useList } from 'react-use'

const formSchema = videoCreateDTO

const PlatformUploadVideoForm = ({
  video,
  videoId,
  setVideo,
  setCompelete,
}: {
  edit: boolean
  video: Partial<VideoCreateDTO>
  videoId?: string
  setVideo: Dispatch<SetStateAction<Partial<VideoCreateDTO> | null>>
  setCompelete: Dispatch<SetStateAction<boolean>>
}) => {
  const atTextareaRef = useRef<AtTextareaRef>(null)

  const form = useForm({
    resolver: zodResolver(formSchema),
  })
  const { createUpdateVideo } = useVideoCreateUpdate(
    {
      ...video,
    },
    videoId
  )
  const { uploadFile } = useUploadFile()
  const { categoryList } = useCategoryList()
  const initialDescription = useRef<string>(video.description ?? '')
  const [coverList, { push }] = useList<string>(video.thumbnail ? [video.thumbnail] : [])
  const [tags, { push: tagsPush, filter: tagsFilter }] = useList<string>([])

  const formStyles = tv({
    slots: {
      item: cn('mt-6 pl-5 text-brand_blue'),
    },
  })

  const { item } = formStyles()

  const onSubmit = async () => {
    // 1️⃣ 如果 thumbnail 是 dataURL 或 blobURL
    if (
      video.thumbnail &&
      (video.thumbnail.startsWith('data:') || video.thumbnail.startsWith('blob:'))
    ) {
      try {
        // 2️⃣ 转为 File 对象
        const response = await fetch(video.thumbnail)
        const blob = await response.blob()
        const file = new File([blob], 'thumbnail.png', { type: blob.type || 'image/png' })

        // 3️⃣ 上传文件
        const { fileUrl } = await uploadFile(file)

        // 4️⃣ 更新 thumbnail 为真实 URL
        setVideo((prev) => ({ ...prev, thumbnail: fileUrl }))
        await new Promise((r) => setTimeout(r))
      } catch {
        return
      }
    }

    // 5️⃣ 提交表单
    const { code } = await createUpdateVideo()

    if (code) return
    setCompelete(true)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => e.preventDefault()}
        onKeyDown={(e) => {
          if (e.key === 'Enter') e.preventDefault()
        }}
        className={'mt-[30px] mr-[30px] bg-white w-4/5 min-w-[900px]'}
      >
        <div className={'ml-8 text-[16px] font-semibold text-[#222] leading-5.5'}>
          <span className={'w-30'}>基本设置</span>
        </div>
        <FormField
          name={'thumbnail'}
          control={form.control}
          render={() => (
            <FormItem className={item()}>
              <div className={'flex items-start text-[#212121]'}>
                <Title title={'封面'} />
                <div className={'flex flex-col flex-1'}>
                  <Label className={'relative mb-4 size-fit'}>
                    <div
                      className={
                        'bg-cover bg-center bg-no-repeat text-white w-[142px] h-[106.5px] rounded-[4px] relative cursor-pointer flex flex-col items-center justify-center group'
                      }
                      style={{
                        backgroundImage: `url('${video.thumbnail}')`,
                      }}
                    >
                      <div
                        className={
                          'absolute inset-0 hidden  rounded-[4px] z-0 bg-black/60 backdrop-blur-[4px] group-hover:block'
                        }
                      ></div>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 18 18'
                        fill='none'
                        className={
                          'hidden group-hover:block size-4.5 mb-1.5 z-1 relative fill-current'
                        }
                      >
                        <path
                          d='M9 3.18768C7.36951 3.18768 5.92389 3.27576 4.86413 3.3661C4.05766 3.43484 3.43464 4.05785 3.36589 4.86432C3.27557 5.92402 3.1875 7.37451 3.1875 9.00015C3.1875 10.6259 3.27557 12.0764 3.36589 13.1361C3.43464 13.9425 4.05766 14.5655 4.86413 14.6343C5.92389 14.7246 7.37443 14.8127 9 14.8127C10.6255 14.8127 12.0761 14.7246 13.1359 14.6343C13.9423 14.5655 14.5653 13.9425 14.6341 13.1361C14.7244 12.0764 14.8125 10.6283 14.8125 9.00015C14.8125 8.8356 14.8107 8.6736 14.8075 8.5161C14.8054 8.20346 15.0554 7.95188 15.3661 7.9497C15.6767 7.94749 15.9303 8.19702 15.9325 8.50819C15.9357 8.66753 15.9375 8.83283 15.9375 9.00015C15.9375 10.6636 15.8474 12.1483 15.755 13.2316C15.6398 14.5839 14.5837 15.6399 13.2314 15.7552C12.148 15.8475 10.6647 15.9377 9 15.9377C7.33528 15.9377 5.85195 15.8475 4.76858 15.7552C3.41625 15.6399 2.36023 14.5839 2.24497 13.2316C2.15263 12.1483 2.0625 10.665 2.0625 9.00015C2.0625 7.33536 2.15263 5.85209 2.24497 4.76877C2.36023 3.41643 3.41625 2.36043 4.76858 2.24517C5.85195 2.15282 7.33067 2.06268 9 2.06268C9.1671 2.06268 9.33251 2.06448 9.492 2.0677C9.80194 2.06982 10.0527 2.32349 10.0505 2.63412C10.0483 2.94477 9.79485 3.19474 9.48405 3.19263C9.32749 3.18945 9.16477 3.18768 9 3.18768Z'
                          fill='currentColor'
                        ></path>
                        <path
                          d='M6.56444 8.71262C6.56486 8.26562 6.74262 7.837 7.05872 7.52092L11.9312 2.64856C12.5905 1.98931 13.6595 1.98962 14.3184 2.64927L15.3499 3.68197C16.0081 4.34093 16.008 5.40857 15.3496 6.06738L10.4774 10.9428C10.1608 11.2595 9.73139 11.4375 9.28361 11.4374L7.68787 11.4373C7.06618 11.4373 6.56238 10.933 6.56296 10.3113L6.56444 8.71262ZM7.85418 8.31643C7.74884 8.42177 7.68956 8.56465 7.68944 8.71367L7.68806 10.211C7.68802 10.267 7.73332 10.3123 7.78931 10.3123L9.28368 10.3124C9.43297 10.3125 9.57611 10.2531 9.68159 10.1476L14.5539 5.27214C14.7733 5.05254 14.7733 4.69666 14.5539 4.47701L13.5224 3.44431C13.3028 3.22442 12.9465 3.22432 12.7267 3.44407L7.85418 8.31643Z'
                          fill='currentColor'
                        ></path>
                      </svg>
                      <span className={'hidden group-hover:block text-xs font-bold relative z-1'}>
                        封面设置
                      </span>
                    </div>
                    <Input
                      accept={'image/*'}
                      onChange={async (e) => {
                        const file = e.target.files?.[0]
                        if (!file) return
                        const url = URL.createObjectURL(file)
                        push(url)
                        setVideo((prev) => ({
                          ...prev,
                          thumbnail: url,
                        }))
                      }}
                      className={'size-0 opacity-0'}
                      type={'file'}
                    />
                  </Label>
                  {!!coverList.length && (
                    <div
                      className={
                        'flex-1 p-3 pr-4 flex-wrap bg-[#f6f7f8] rounded-[8px] flex flex-col min-w-0'
                      }
                    >
                      <div
                        className={
                          'text-[#757575] flex items-center select-none  font-normal  tracking-normal leading-4.5 text-xs'
                        }
                      >
                        系统默认选中第一帧为视频封面
                      </div>
                      <div className={'flex items-center  justify-between'}>
                        <div className={'flex w-full  flex-wrap'}>
                          {coverList.map((item) => (
                            <div
                              className={
                                'w-[106px] h-[79.5px] mt-1.5 relative  rounded-[4px] flex items-center justify-center mr-2'
                              }
                              key={item}
                            >
                              <div
                                style={{
                                  backgroundImage: `url('${item}')`,
                                }}
                                className={
                                  'cursor-pointer  relative  bg-cover bg-center bg-no-repeat transition-all duration-300 ease size-full rounded-[4px] group'
                                }
                                onClick={() => {
                                  setVideo((prev) => ({
                                    ...prev,
                                    thumbnail: item,
                                  }))
                                }}
                              >
                                <div
                                  style={{
                                    backgroundImage: `url('${item}')`,
                                  }}
                                  className={
                                    'absolute z-10 bg-cover bg-center bg-no-repeat  hidden w-[220px]  h-[165px] -top-[175px] left-0  group-hover:block rounded-[4px]'
                                  }
                                ></div>
                                {item === video.thumbnail && (
                                  <div
                                    className={
                                      'flex absolute inset-0 bg-black/50 items-center justify-center rounded-[4px]'
                                    }
                                  >
                                    <svg
                                      className={'size-5 fill-current text-transparent'}
                                      xmlns='http://www.w3.org/2000/svg'
                                      viewBox='0 0 22 22'
                                      fill='none'
                                      id='videoup-icon-duihao'
                                    >
                                      <path
                                        d='M19.25 5.5L8.43966 17.8154L3.0686 12.5503'
                                        stroke='#00A1D6'
                                        strokeWidth='2'
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                      ></path>
                                    </svg>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </FormItem>
          )}
        />
        <FormField
          name={'title'}
          control={form.control}
          render={({ field }) => (
            <FormItem className={item()}>
              <div className={'flex items-start'}>
                <Title title={'标题'} />
                <div className={'flex-1'}>
                  <div
                    className={
                      'bg-[hsla(0,0%,84.7%,0)] border border-[#ccd0d7] rounded-[4px] px-3 flex items-center flex-wrap transform-border ease-in-out duration-300 hover:border-brand_blue'
                    }
                  >
                    <div className={'flex-1 min-w-50 my-1.5'}>
                      <Input
                        className={
                          'block w-full text-[#222] leading-5.5 h-5.5 text-sm outline-none '
                        }
                        maxLength={80}
                        {...field}
                        value={video.title}
                        onChange={(e) => {
                          setVideo((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }}
                      />
                    </div>
                    <div
                      className={'text-sm text-[#9ba4ac] my-2 ml-3'}
                    >{`${video.title?.length ?? 0}/80`}</div>
                  </div>
                </div>
              </div>
            </FormItem>
          )}
        />
        <FormField
          name={'categoryId'}
          render={({ field }) => (
            <FormItem className={item()}>
              <div className={'flex relative'}>
                <Title title={'分区'} />
                <div className={'relative'}>
                  <Select
                    {...field}
                    value={video.categoryId}
                    onValueChange={(e) => {
                      setVideo((prev) => ({
                        ...prev,
                        categoryId: e,
                      }))
                    }}
                  >
                    <SelectTrigger
                      className={
                        'py-1.5 px-3 border border-[#ccd0d7] rounded-[4px] min-w-50 inline-flex justify-between items-center cursor-pointer text-[#222] leading-[22px]  text-sm whitespace-nowrap transition-colors duration-300 ease-in-out bg-white hover:border-brand_blue data-[state=open]:border-brand_blue'
                      }
                    >
                      <SelectValue></SelectValue>
                    </SelectTrigger>
                    <SelectContent
                      side={'bottom'}
                      className={
                        'min-w-[226px] mt-1.5 py-1.5 bg-white border border-line_regular z-10'
                      }
                    >
                      <SelectGroup className={'h-[250px] overflow-x-hidden overflow-y-auto'}>
                        {categoryList?.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </FormItem>
          )}
        />
        <div className={item()}>
          <div className={'flex items-center'}>
            <Title title={'标签'} />
            <div className={'flex-1 mt-3'}>
              <div
                className={
                  'border border-[#ccd0d7] bg-[hsla(0,0%,84.7%,0)] rounded-[4px] px-3 flex items-center flex-wrap transition-colors duration-300 ease-in-out focus-within:border-brand_blue hover:border-brand_blue'
                }
              >
                <div className={'flex flex-wrap'}>
                  {tags.map((tag) => (
                    <div
                      className={
                        'my-1 mr-1.5 bg-brand_blue rounded-[4px] flex items-center cursor-pointer pr-[9px] pl-[11px]'
                      }
                      key={tag}
                      onClick={() => {
                        tagsFilter((item) => item !== tag)
                      }}
                    >
                      <span
                        className={
                          'leading-[30px] max-w-60 text-white text-xs overflow-hidden text-ellipsis whitespace-nowrap select-none'
                        }
                      >
                        {tag}
                      </span>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 1024 1024'
                        className={'size-[9px] text-white fill-current ml-1 text-xs leading-[14px]'}
                      >
                        <defs>
                          <style type='text/css'></style>
                        </defs>
                        <path
                          fill='currentColor'
                          d='M507 457.2l348.8-348.8c16.5-16.5 43.3-16.5 59.8 0s16.5 43.3 0 59.8L566.8 517l338.8 338.8c16.5 16.5 16.5 43.3 0 59.8s-43.3 16.5-59.8 0L507 576.8 178.1 905.6c-16.5 16.5-43.3 16.5-59.8 0s-16.5-43.3 0-59.8L447.2 517 108.4 178.1c-16.5-16.5-16.5-43.3 0-59.8s43.3-16.5 59.8 0L507 457.2z'
                          p-id='25745'
                        ></path>
                      </svg>
                    </div>
                  ))}
                </div>
                <div className={'flex-1 min-w-[200px] my-1.5'}>
                  <Input
                    className={'block w-full text-[#222] leading-5.5 h-5.5 text-sm outline-none'}
                    maxLength={20}
                    placeholder={'按回车键Enter创建标签'}
                    type={'text'}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.stopPropagation()
                        e.preventDefault()
                        const value = (e.target as HTMLInputElement).value.trim()
                        if (value && tags.length < 10 && !tags.includes(value)) {
                          tagsPush(value)
                          ;(e.target as HTMLInputElement).value = ''
                        }
                      }
                    }}
                  />
                </div>
                <div
                  className={'text-sm text-[#858585] my-2 ml-3 cursor-default'}
                >{`还可以添加${10 - tags.length}个标签`}</div>
              </div>
            </div>
          </div>
        </div>
        <FormField
          name={'description'}
          control={form.control}
          render={() => (
            <FormItem className={item()}>
              <div className={'flex text-[#212121] items-start'}>
                <Title title={'简介'} required={false} />
                <div className={'w-4/5 min-w-[700px] mt-3 flex-1'}>
                  <div className={'h-40 relative'}>
                    <div
                      className={
                        'border border-[#ccc] mt-2.5 rounded-[8px] text-[13px] h-full relative'
                      }
                    >
                      <AtTextarea
                        className={'py-3 pl-[15px] pr-15 h-40 leading-[1.42]'}
                        ref={atTextareaRef}
                        onUpdate={() => {
                          setVideo((prev) => ({
                            ...prev,
                            description: atTextareaRef.current?.getEditor()?.getText(),
                          }))
                        }}
                        initialContent={initialDescription.current ?? ''}
                      />
                      <AtTextareaPlaceholder
                        className={'top-3 left-[15px] leading-[1.42]'}
                        atTextCount={video.description?.length ?? 0}
                      >
                        填写更全面的相关信息，让更多的人能找到你的视频吧
                      </AtTextareaPlaceholder>
                    </div>
                    <div
                      className={'flex text-[#9ba4ac] text-xs absolute bottom-4 right-[15px]'}
                    >{`${video.description?.length ?? 0}/2000`}</div>
                  </div>
                </div>
              </div>
            </FormItem>
          )}
        />
        <div className={item()}>
          <div className={'flex items-end py-8 pl-[134px] relative'}>
            <Button
              className={
                'ml-4 leading-10 text-white bg-brand_blue inline-block h-10 text-sm rounded-[4px] text-center align-middle w-30 cursor-pointer select-none transition-all duration-500 ease-in-out'
              }
              type={'submit'}
              onClick={async (e) => {
                e.preventDefault()
                await onSubmit()
              }}
            >
              立即投稿
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}

const Title = ({ title, required = true }: { title: string; required?: boolean }) => {
  return (
    <div className={cn('mt-1.5 inline-flex items-center relative flex-wrap w-[134px]')}>
      {required && <span className={'text-[16px] text-[#ff3b30] leading-4 w-3'}>*</span>}
      <span className={'text-sm font-normal text-[#212121] leading-[21px]'}>{title}</span>
    </div>
  )
}

export default PlatformUploadVideoForm
