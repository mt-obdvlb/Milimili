'use client'

import React, {
  cloneElement,
  Dispatch,
  ReactElement,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from 'react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
} from '@/components'
import DialogFooterBtnWrapper from '@/components/layout/models/common/DialogFooterBtnWrapper'
import { useFavoriteDetail, useFavoriteFolderAdd, useFavoriteFolderUpdate } from '@/features'
import UploadImage from '@/components/layout/models/upload/uploadImage'
import { fileToBlobUrl } from '@/utils'
import { Textarea } from '@/components/ui/textarea'
import { z } from 'zod/v4'
import { SubmitErrorHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'

// zod schema（保留并导出以便复用）
export const favoriteFolderAddDTO = z.object({
  name: z.string().min(1, '名称不能为空').max(20, '长度最多 20 字'),
  description: z.string().optional(),
  thumbnail: z.string().optional(),
})
export type FavoriteFolderAddDTO = z.infer<typeof favoriteFolderAddDTO>

const FavoriteAddModel: React.FC<{
  children?: ReactNode
  folderId?: string
  open?: boolean
  setOpen?: Dispatch<SetStateAction<boolean>>
}> = ({ children, folderId, open, setOpen }) => {
  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = open !== undefined && setOpen !== undefined
  const dialogOpen = isControlled ? open : internalOpen
  const setDialogOpen = (value: boolean) => {
    if (isControlled) setOpen!(value)
    else setInternalOpen(value)
  }
  const { favoriteFolderAdd } = useFavoriteFolderAdd()
  const { favoriteFolderUpdate } = useFavoriteFolderUpdate()
  const [url, setUrl] = useState<string>('')
  const [fileUrl, setFileUrl] = useState('')
  const [uploadOpen, setUploadOpen] = useState(false)
  const { favoriteDetail } = useFavoriteDetail(folderId ?? '')

  const form = useForm<FavoriteFolderAddDTO>({
    resolver: zodResolver(favoriteFolderAddDTO),
    defaultValues: {
      name: '',
      description: '',
      thumbnail: '',
    },
    mode: 'onChange',
    reValidateMode: 'onBlur',
  })

  // 填充表单数据（修改模式）
  useEffect(() => {
    if (folderId && favoriteDetail && dialogOpen) {
      setUrl(favoriteDetail.thumbnail || '')
      form.reset({
        name: favoriteDetail.name,
        description: favoriteDetail.description || '',
        thumbnail: favoriteDetail.thumbnail || '',
      })
    }
  }, [folderId, favoriteDetail, form, dialogOpen])

  // 当 url 改变时同步到表单
  useEffect(() => {
    if (url) form.setValue('thumbnail', url)
  }, [url, form])

  // 当 dialog 关闭时重置表单和状态
  useEffect(() => {
    if (!dialogOpen) {
      form.reset()
      setUrl('')
      setFileUrl('')
      setUploadOpen(false)
    }
  }, [dialogOpen, form])

  const onSubmit = async (payload: FavoriteFolderAddDTO) => {
    if (folderId) {
      await favoriteFolderUpdate({ id: folderId, body: payload })
    } else {
      await favoriteFolderAdd(payload)
    }

    setDialogOpen(false)
    form.reset()
    setUrl('')
    setFileUrl('')
    setUploadOpen(false)
  }

  const onError: SubmitErrorHandler<FavoriteFolderAddDTO> = () => {
    // 错误处理
  }

  const nameValue = form.watch('name')
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>{cloneElement(children as ReactElement)}</DialogTrigger>
      <DialogContent
        className={
          'text-text1 bg-bg1 w-[388px] rounded-xl px-6 pt-4 pb-6 text-sm shadow-[0_8px_40px_rgba(0,0,0,.1)]'
        }
      >
        <DialogHeader>
          <DialogTitle className={'text-text1 text-center text-[16px] leading-[22px] font-medium'}>
            新建文件夹
          </DialogTitle>
        </DialogHeader>

        {/* 使用 shadcn 的 Form 包裹 RHF */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, onError)}
            className={'text-text1 mt-2 mb-6 pt-6 pb-[22px] text-left text-sm font-normal'}
          >
            <div>
              <UploadImage
                setDialogOpen={setUploadOpen}
                dialogOpen={uploadOpen}
                imgUrl={fileUrl}
                setUrl={setUrl}
              >
                <div className={'relative h-[89px] w-[158px]'}>
                  <div
                    className={
                      'bg-graph_bg_thick relative h-[89px] w-[158px] overflow-hidden rounded-[6px]'
                    }
                  >
                    <div>
                      {url && (
                        <picture className={'inline-block size-full align-middle'}>
                          <img src={url} className={'block size-full'} alt={url} />
                        </picture>
                      )}
                    </div>
                    <label
                      className={
                        'absolute top-1/2 left-1/2 size-full -translate-1/2 cursor-pointer'
                      }
                    >
                      <Input
                        accept='image/png, image/jpeg, image/webp'
                        type={'file'}
                        className={'size-0 opacity-0'}
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (!file) return
                          setFileUrl(fileToBlobUrl(file))
                          setUploadOpen(true)
                        }}
                      />
                      {!url && (
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          viewBox='0 0 40 40'
                          width='40'
                          height='40'
                          className={'absolute top-1/2 left-1/2 -translate-1/2'}
                        >
                          <path
                            d='M19.99675 5.833333333333334C20.687083333333334 5.833333333333334 21.24675 6.3929833333333335 21.24675 7.083333333333334L21.24675 18.74966666666667L32.91666666666667 18.74966666666667C33.607000000000006 18.74966666666667 34.16666666666667 19.30925 34.16666666666667 19.99966666666667C34.16666666666667 20.69 33.607000000000006 21.24966666666667 32.91666666666667 21.24966666666667L21.24675 21.24966666666667L21.24675 32.91666666666667C21.24675 33.607000000000006 20.687083333333334 34.16666666666667 19.99675 34.16666666666667C19.306333333333335 34.16666666666667 18.74675 33.607000000000006 18.74675 32.91666666666667L18.74675 21.24966666666667L7.083333333333334 21.24966666666667C6.3929833333333335 21.24966666666667 5.833333333333334 20.69 5.833333333333334 19.99966666666667C5.833333333333334 19.30925 6.3929833333333335 18.74966666666667 7.083333333333334 18.74966666666667L18.74675 18.74966666666667L18.74675 7.083333333333334C18.74675 6.3929833333333335 19.306333333333335 5.833333333333334 19.99675 5.833333333333334z'
                            fill='currentColor'
                          ></path>
                        </svg>
                      )}
                    </label>
                  </div>
                  <div
                    className={
                      'bg-graph_bg_regular absolute -top-[5px] right-0 left-0 m-auto h-[5px] w-[90%] rounded-t-[6px] rounded-r-[6px]'
                    }
                  ></div>
                  <div
                    className={
                      'bg-bg2 absolute -top-2.5 right-0 left-0 m-auto h-[5px] w-[80%] rounded-t-[6px] rounded-r-[6px]'
                    }
                  ></div>
                </div>
              </UploadImage>

              <p className={'mt-6 mb-2 text-sm leading-[20px]'}>
                名称 <span className={'text-red-500'}>*</span>
              </p>

              <div className={'inline-flex w-full'}>
                <div
                  className={
                    'bg-bg1 border-line_regular text-4 px-sm relative inline-flex w-full grow overflow-hidden rounded-[6px] border'
                  }
                >
                  {/* name 字段（RHF + shadcn FormField） */}
                  <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                      <FormItem className='m-0 w-full'>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder={'快来给你的收藏夹命名吧'}
                            className={
                              'text-text1 h-h-md leading-md inline-flex w-full border-none p-0 outline-none'
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <p className={'mt-6 mb-2 text-sm leading-5'}>简介</p>
              <div className={'inline-flex w-full'}>
                <div
                  className={
                    'bg-bg1 border-line_regular text-4 px-sm relative inline-flex w-full grow overflow-hidden rounded-[6px] border'
                  }
                >
                  <div className={'relative w-full overflow-hidden'}>
                    {/* description 字段 */}
                    <FormField
                      control={form.control}
                      name='description'
                      render={({ field }) => (
                        <FormItem className='m-0 w-full'>
                          <FormControl>
                            <Textarea
                              {...field}
                              className={
                                'text-text1 h-h-md leading-md inline-block min-h-[8em] w-full resize-none whitespace-pre-wrap'
                              }
                              rows={4}
                              placeholder={'可以简单描述下你的收藏夹'}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className={'bg-bg1 mt-6 flex h-8 items-center justify-center gap-3'}>
              <DialogFooterBtnWrapper
                handleConfirm={async () => {
                  await form.handleSubmit(onSubmit)()
                }}
                disabled={!nameValue?.trim() || form.formState.isSubmitting}
                setDialogOpen={setDialogOpen as Dispatch<SetStateAction<boolean>>}
              />
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default FavoriteAddModel
