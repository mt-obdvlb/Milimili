'use client'

import { tv } from 'tailwind-variants'
import { cn, toast } from '@/lib'
import { feedCreateDTO } from '@mtobdvlb/shared-types'
import { z } from 'zod/v4'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button, Form, FormControl, FormField, FormItem, Input } from '@/components'
import AtTextarea, { AtTextareaRef } from '@/components/layout/at/AtTextarea'
import { useRef, useState } from 'react'
import { useFeedPublish, useUploadFile } from '@/features'
import { FeedSortableImage } from '@/features/feed/components/FeedSortableImage'

const feedPublishSchema = feedCreateDTO
type FeedPublishForm = z.infer<typeof feedPublishSchema>

const FeedPublishWrapper = () => {
  const publishStyles = tv({
    slots: {
      base: 'bg-bg1 rounded-[6px] p-5 pb-3 relative w-full',
      title: 'h-6 mt-1.5 pr-12 relative w-full',
      input: 'mt-1 mr-2 mb-3',
      imageUpload: cn('mt-0.5'),
      control: cn('items-center flex justify-between'),
    },
  })
  const { base, control, input, title: titleStyles, imageUpload } = publishStyles()

  const form = useForm<FeedPublishForm>({
    resolver: zodResolver(feedPublishSchema),
    defaultValues: {
      title: '',
      content: '',
      imageUrls: [],
    },
  })

  const title = form.watch('title')
  const imageUrls = form.watch('imageUrls')

  const atTextRef = useRef<AtTextareaRef>(null)

  const [textCount, setTextCount] = useState(0)
  const [isUpload, setIsUpload] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { uploadFile } = useUploadFile()
  const { publishFeed } = useFeedPublish()

  const onSubmit = async (data: FeedPublishForm) => {
    data.content = atTextRef.current?.getEditor()?.getText() ?? ''
    console.log('submit', data)
    const { code } = await publishFeed(data)
    if (code) return
    form.reset()
    atTextRef.current?.reset()
    setIsUpload(false)
    toast('发布成功')
  }
  return (
    <section className='mb-2 w-full'>
      <Form {...form}>
        <form className={base()} onSubmit={form.handleSubmit(onSubmit)}>
          {/* 标题 */}
          <FormField
            control={form.control}
            name='title'
            render={({ field }) => (
              <FormItem className={cn(titleStyles())}>
                <FormControl>
                  <Input
                    {...field}
                    maxLength={20}
                    className='bg-bg1 border-none  text-[15px] font-medium h-6 leading-6 outline-none w-full placeholder:leading-6 placeholder:text-[15px]'
                    placeholder='好的标题更容易获得支持，选填20字'
                  />
                </FormControl>
                <div
                  className={cn(
                    'flex h-full absolute right-0 top-0 w-12',
                    !title?.length && 'hidden'
                  )}
                >
                  <div className='items-center cursor-pointer flex h-full justify-center w-6'>
                    <div
                      onClick={() => form.setValue('title', '')}
                      className='items-center bg-graph_weak rounded-full text-text_white flex size-4 justify-center'
                    >
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 8 8'
                        width='8'
                        height='8'
                        className='size-2'
                      >
                        <path
                          d='M1.28895 1.2898733333333334C1.5818566666666654 0.9969799999999991 2.0567133333333345 0.9969799999999991 2.349603333333332 1.2898733333333334L3.9994666666666667 2.939749999999999L5.6498333333333335 1.2893266666666667C5.942750000000002 0.9964333333333324 6.4176499999999965 0.9964333333333324 6.71048333333333 1.2893266666666667C7.00351666666667 1.5822166666666677 7.00351666666667 2.0570899999999996 6.71048333333333 2.3499799999999986L5.060116666666667 4.0004L6.710050000000003 5.650416666666669C7.003083333333336 5.943250000000003 7.003083333333336 6.418149999999997 6.710050000000003 6.7109833333333295C6.417216666666663 7.0039 5.942316666666663 7.0039 5.6494 6.7109833333333295L3.9994666666666667 5.06105L2.3500533333333333 6.710533333333332C2.057143333333334 7.0033666666666665 1.5822900000000004 7.0033666666666665 1.28938 6.710533333333332C0.996489999999999 6.4175 0.996489999999999 5.942716666666669 1.28938 5.649883333333336L2.938816666666666 4.0004L1.28895 2.3505266666666653C0.9960566666666673 2.0576366666666663 0.9960566666666673 1.5827633333333344 1.28895 1.2898733333333334z'
                          fill='currentColor'
                        />
                      </svg>
                    </div>
                  </div>
                  <div className='text-text3 text-[13px] leading-6 text-right w-6'>
                    {title?.length ?? 0}
                  </div>
                </div>
              </FormItem>
            )}
          />

          {/* 内容 */}
          <FormField
            control={form.control}
            name={'content'}
            render={() => (
              <FormItem className={cn(input())}>
                <FormControl>
                  <div
                    className={cn(
                      'max-h-[180px] cursor-text h-full overflow-y-auto relative w-full'
                    )}
                  >
                    {!textCount && (
                      <div
                        className={
                          'text-text3 text-[15px] leading-6 absolute z-2 tracking-[1px] pointer-events-none left-0 top-0'
                        }
                      >
                        有什么想和大家分享的？
                      </div>
                    )}
                    <AtTextarea
                      className={
                        'text-[15px] leading-6 min-h-6 break-words bg-bg1 text-text1 tracking-[1px] pr-[5px] outline-none relative block align-baseline whitespace-pre-wrap w-full break-all'
                      }
                      onUpdate={(count, html) => {
                        setTextCount(count)
                        form.setValue('content', html) // 同步内容到 react-hook-form
                      }}
                      ref={atTextRef}
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          {/*图片上传*/}
          <FeedSortableImage
            imageUrls={imageUrls ?? []}
            setImageUrls={(urls: string[]) => form.setValue('imageUrls', urls)}
            fileInputRef={fileInputRef}
            uploadFile={uploadFile}
            imageUploadClassName={cn(imageUpload(), !isUpload && 'hidden')}
          />

          {/* 控制区 */}
          <div className={cn(control())}>
            <div className={'items-center flex relative'}>
              <div
                className={cn(
                  'bg-no-repeat bg-contain text-text3 cursor-pointer h-6 mr-4 select-none w-6 hover:text-brand_blue',
                  isUpload && 'text-brand_blue'
                )}
                onClick={() => {
                  setIsUpload(!isUpload)
                  if (!isUpload) fileInputRef.current?.click()
                }}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                  width='24'
                  height='24'
                  className={'size-6'}
                >
                  <path
                    d='M8.5 8.47247C7.93252 8.47247 7.4725 8.93249 7.4725 9.49997C7.4725 10.06746 7.93252 10.52745 8.5 10.52745C9.06747 10.52745 9.5275 10.06746 9.5275 9.49997C9.5275 8.93249 9.06747 8.47247 8.5 8.47247zM6.0275 9.49997C6.0275 8.13444 7.13448 7.02746 8.5 7.02746C9.86552 7.02746 10.9725 8.13444 10.9725 9.49997C10.9725 10.86545 9.86552 11.97245 8.5 11.97245C7.13448 11.97245 6.0275 10.86545 6.0275 9.49997z'
                    fill='currentColor'
                  ></path>
                  <path
                    d='M12 4.99756C9.48178 4.99756 7.283 5.12566 5.73089 5.25153C4.65221 5.339 3.81611 6.16303 3.72 7.23205C3.60607 8.49931 3.5 10.1705 3.5 11.9976C3.5 13.82465 3.60607 15.4958 3.72 16.7631C3.81611 17.8321 4.65221 18.65615 5.73089 18.7436C7.283 18.8695 9.48178 18.9976 12 18.9976C14.5185 18.9976 16.7174 18.8694 18.2696 18.74355C19.3481 18.6561 20.184 17.8323 20.2801 16.76355C20.394 15.49685 20.5 13.82595 20.5 11.9976C20.5 10.16915 20.394 8.49828 20.2801 7.23156C20.184 6.16281 19.3481 5.33903 18.2696 5.25156C16.7174 5.12569 14.5185 4.99756 12 4.99756zM5.60965 3.75644C7.19232 3.6281 9.43258 3.49756 12 3.49756C14.5677 3.49756 16.8081 3.62812 18.3908 3.75647C20.1881 3.90224 21.6118 5.2923 21.7741 7.09724C21.8909 8.39641 22 10.11355 22 11.9976C22 13.88155 21.8909 15.5987 21.7741 16.8979C21.6118 18.7028 20.1881 20.0929 18.3908 20.23865C16.8081 20.367 14.5677 20.4976 12 20.4976C9.43258 20.4976 7.19232 20.367 5.60965 20.2387C3.81206 20.0929 2.38831 18.7025 2.22603 16.8974C2.10918 15.5977 2 13.8803 2 11.9976C2 10.1148 2.10918 8.39738 2.22603 7.09774C2.38831 5.29263 3.81206 3.90221 5.60965 3.75644z'
                    fill='currentColor'
                  ></path>
                  <path
                    d='M15.8624 13.5532C15.4524 13.1431 14.78755 13.1431 14.37745 13.55315L12.3451 15.58555C11.4912 16.43945 10.1065 16.43915 9.25299 15.5847C8.91511 15.2465 8.36696 15.24635 8.02887 15.5844L6.5303 17.08275C6.23739 17.3756 5.76251 17.3756 5.46964 17.0827C5.17676 16.7898 5.17679 16.3149 5.4697 16.022L6.96829 14.52365C7.89238 13.59965 9.39064 13.6001 10.3142 14.5246C10.58205 14.7927 11.0165 14.79285 11.28445 14.5249L13.31675 12.4925C14.31265 11.4966 15.92735 11.49665 16.9232 12.49265L18.5304 14.1001C18.82325 14.393 18.8232 14.86785 18.53025 15.16075C18.23735 15.4536 17.7625 15.4536 17.4696 15.16065L15.8624 13.5532z'
                    fill='currentColor'
                  ></path>
                </svg>
              </div>
              <div
                className={
                  'bg-no-repeat bg-contain text-text3 cursor-pointer h-6 mr-4 select-none w-6 hover:text-brand_blue'
                }
                onClick={() => {
                  atTextRef.current?.insertMention()
                }}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                  width='24'
                  height='24'
                  className={'size-6'}
                >
                  <path
                    d='M11.357 8.46436C9.86897 8.46436 8.46413 9.92845 8.46413 12.0001C8.46413 14.0717 9.86897 15.5358 11.357 15.5358C12.845 15.5358 14.2498 14.0717 14.2498 12.0001C14.2498 9.92845 12.845 8.46436 11.357 8.46436zM6.96413 12.0001C6.96413 9.33784 8.82121 6.96436 11.357 6.96436C13.89275 6.96436 15.7498 9.33784 15.7498 12.0001C15.7498 14.6623 13.89275 17.0358 11.357 17.0358C8.82121 17.0358 6.96413 14.6623 6.96413 12.0001z'
                    fill='currentColor'
                  ></path>
                  <path
                    d='M15.2144 7.39282C15.62865 7.39282 15.9644 7.72861 15.9644 8.14282L15.9644 13.8378C15.9644 14.91395 16.8735 15.598 17.98735 15.4706C19.01245 15.3533 20.28405 14.4599 20.4329 12.05135C20.4585 11.6379 20.8143 11.32345 21.22775 11.34905C21.64115 11.3746 21.9556 11.73045 21.93005 12.1439C21.74465 15.1426 20.03275 16.74635 18.15785 16.96085C16.3718 17.1652 14.4644 16.01585 14.4644 13.8378L14.4644 8.14282C14.4644 7.72861 14.80025 7.39282 15.2144 7.39282z'
                    fill='currentColor'
                  ></path>
                  <path
                    d='M12 3.5625C7.3401 3.5625 3.5625 7.3401 3.5625 12C3.5625 16.6599 7.3401 20.4375 12 20.4375C13.6982 20.4375 15.2771 19.9366 16.5998 19.07465C16.94685 18.84855 17.4115 18.94655 17.63765 19.2936C17.86375 19.6406 17.76575 20.1053 17.4187 20.33145C15.8598 21.34725 13.9977 21.9375 12 21.9375C6.51167 21.9375 2.0625 17.48835 2.0625 12C2.0625 6.51167 6.51167 2.0625 12 2.0625C17.48835 2.0625 21.9375 6.51167 21.9375 12C21.9375 12.4142 21.6017 12.75 21.1875 12.75C20.7733 12.75 20.4375 12.4142 20.4375 12C20.4375 7.3401 16.6599 3.5625 12 3.5625z'
                    fill='currentColor'
                  ></path>
                </svg>
              </div>
            </div>
            <div className={'items-center flex justify-center ml-5'}>
              <div className={'text-text3 text-sm relative select-none mr-[25px]'}>{textCount}</div>
              <Button
                disabled={!textCount}
                onClick={() => onSubmit(form.getValues())}
                type={'button'}
                className={cn(
                  'min-w-[70px] items-center bg-brand_blue rounded-[6px] text-text_white cursor-pointer flex text-sm h-8 select-none justify-center w-[70px]',
                  !textCount && 'cursor-not-allowed opacity-50'
                )}
              >
                发布
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </section>
  )
}

export default FeedPublishWrapper
