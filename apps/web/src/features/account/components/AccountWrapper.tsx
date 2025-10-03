'use client'

import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Input,
  Label,
} from '@/components'
import { useUserGet, useUserUpdateInfo } from '@/features'
import { userUpdateDTO } from '@mtobdvlb/shared-types'
import { z } from 'zod/v4'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { cn, toast } from '@/lib'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import UserAvatar from '@/components/ui/UserAvatar'
import UploadImage from '@/components/layout/models/upload/uploadImage'

const accountUpdateSchema = userUpdateDTO
type AccountUpdateForm = z.infer<typeof accountUpdateSchema>

const AccountWrapper = () => {
  const { user } = useUserGet()
  const { updateUserInfo } = useUserUpdateInfo()

  const form = useForm({
    resolver: zodResolver(accountUpdateSchema),
    defaultValues: {
      name: '',
      avatar: '',
    },
  })

  useEffect(() => {
    if (!user) return
    setSelectAvatar(user.avatar)
    form.reset({ name: user.name, avatar: user.avatar })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const onSubmit = async (data: AccountUpdateForm) => {
    const { code } = await updateUserInfo(data)
    if (code) return
    toast('更新成功')
    window.location.reload()
  }

  const avatar = form.watch('avatar')

  const [isUpload, setIsUpload] = useState(false)
  const [selectAvatar, setSelectAvatar] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [img, setImg] = useState<string>('')

  useEffect(() => {
    if (img && img.startsWith('http')) {
      console.log(img)
      setSelectAvatar(img)
    }
  }, [img])

  return (
    <>
      <div className={'h-[50px] pl-[30px] text-sm flex items-center border-b border-b-[#ddd] '}>
        {isUpload ? (
          <div className={'text-text1 w-full'}>
            <span onClick={() => setIsUpload(false)} className={'text-text2 cursor-pointer'}>
              我的信息
            </span>
            {' > 更换头像'}
          </div>
        ) : (
          <>
            <span className={'w-1 h-4  bg-[#00a1d6] rounded-[4px]'}></span>
            <span className={'ml-[5px] text-[#00a1d6] text-sm cursor-default '}>我的信息</span>
          </>
        )}
      </div>
      <main className={'px-5 pt-5'}>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (errors) => {
              toast(
                Object.values(errors)
                  .map((error) => error.message)
                  .join(';')
              )
            })}
          >
            {isUpload ? (
              <>
                <div className={'mx-auto pt-20 flex px-5 w-100 pb-[56px]'}>
                  <div className={'h-[182px] relative mr-10 flex items-center justify-center'}>
                    <UploadImage
                      ASPECT={1}
                      setUrl={setImg}
                      imgUrl={img}
                      dialogOpen={dialogOpen}
                      setDialogOpen={setDialogOpen}
                    >
                      <Label
                        className={
                          'cursor-pointer bg-[#f1f2f5] relative hover:bg-[#e5e9ef] w-[178px] h-21 border border-line_regular rounded-[4px] transition-all duration-600 ease flex items-center pl-2.5'
                        }
                      >
                        <Image
                          src={'/images/account-upload.png'}
                          alt={'上传头像'}
                          width={36}
                          height={36}
                        />
                        <span
                          className={
                            'block text-sm text-[#5a6267] leading-5 tracking-normal ml-1.5'
                          }
                        >
                          选择本地图片
                        </span>
                        <Input
                          className={'size-full absolute inset-0 -z-1'}
                          type={'file'}
                          onChange={(e) => {
                            if (!e.target.files?.[0]) return
                            setImg(URL.createObjectURL(e.target.files[0]))
                            setDialogOpen(true)
                          }}
                        />
                      </Label>
                    </UploadImage>
                  </div>
                  <div className={'h-[182px] w-[1px] bg-line_regular'}></div>
                  <div className={'ml-10 mt-[30px]'}>
                    <div
                      className={
                        'size-[96px] overflow-hidden rounded-full border border-[#e6eaf0] bg-cover'
                      }
                    >
                      <UserAvatar avatar={selectAvatar} h={96} w={96} />
                    </div>
                    <div className={'mt-5 text-xs text-text3 text-center'}>当前头像</div>
                  </div>
                </div>
                <div className={'leading-4 text-text3 text-center text-xs'}>
                  请选择图片上传：大小180 * 180像素支持JPG、PNG等格式
                </div>
                <div className={'text-center mt-10'}>
                  <Button
                    onClick={(e) => {
                      e.preventDefault()
                      form.setValue('avatar', selectAvatar)
                      setIsUpload(false)
                    }}
                    type={'button'}
                    disabled={selectAvatar === avatar}
                    className={cn(
                      'w-[140px] h-10 text-sm leading-8 rounded-[4px] border border-[#00a1d6] bg-brand_blue text-white',
                      selectAvatar === avatar && 'bg-bg3 border-bg3 text-[#ccd0d7]'
                    )}
                  >
                    更新
                  </Button>
                </div>
              </>
            ) : (
              <>
                <FormField
                  name={'name'}
                  render={({ field }) => (
                    <FormItem className={'flex items-center w-full mb-[22px]'}>
                      <FormLabel
                        className={
                          'w-[95px] text-right mr-5 leading-[30px] align-middle text-sm text-[#606266]'
                        }
                      >
                        名字:
                      </FormLabel>
                      <FormControl>
                        <Input
                          className={
                            'w-[225px] h-[30px] border border-[#dcdfe6] rounded-[4px] bg-white text-[#606266] px-[15px] transition-colors duration-200 ease-in-out hover:border-[#c0c4cc] focus:border-brand_blue'
                          }
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name={'avatar'}
                  render={() => (
                    <FormItem className={'py-5'}>
                      <div
                        className={'size-50 border border-[#e5e9ef] rounded-full relative mx-auto'}
                      >
                        <div
                          className={
                            'cursor-pointer size-[54px] rounded-full absolute top-1/2 -translate-y-1/2 -left-[27px] border border-brand_blue bg-brand_blue text-white'
                          }
                          onClick={() => setIsUpload(true)}
                        >
                          <span
                            className={
                              'w-[2em] text-sm z-2 leading-3.5 absolute  top-1/2 left-1/2 text-white -translate-1/2'
                            }
                          >
                            更换头像
                          </span>
                        </div>
                        <div className={'size-[168px] absolute top-1/2 left-1/2 -translate-1/2'}>
                          {avatar && (
                            <Image
                              src={avatar}
                              alt={'头像'}
                              width={96}
                              height={96}
                              className={'rounded-full absolute top-1/2 left-1/2 -translate-1/2'}
                            />
                          )}
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
                <div
                  className={
                    'flex h-[116px] w-full  border-t border-t-[#e5e9ef] mt-10  items-end justify-center'
                  }
                >
                  <Button
                    type={'submit'}
                    className={
                      'rounded-[4px] text-sm py-3 px-5 font-medium text-white border border-[409eff] bg-brand_blue hover:opacity-80 transition-opacity opacity-100 duration-300 ease-in-out w-[110px] text-center'
                    }
                  >
                    保存
                  </Button>
                </div>
              </>
            )}
          </form>
        </Form>
      </main>
    </>
  )
}

export default AccountWrapper
