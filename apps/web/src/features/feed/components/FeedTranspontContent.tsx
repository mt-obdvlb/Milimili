'use client'

import UserAvatar from '@/components/ui/UserAvatar'
import { cn, toast } from '@/lib'
import AtTextarea, { AtTextareaRef } from '@/components/layout/at/AtTextarea'
import { useFeedTranspont } from '@/features'
import { useUserStore } from '@/stores'
import { useRef, useState } from 'react'
import { feedTranspontDTO } from '@mtobdvlb/shared-types'
import { z } from 'zod/v4'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'

const feedTranspontSchema = feedTranspontDTO
type FeedTranspontForm = z.infer<typeof feedTranspontSchema>

const FeedTranspontContent = ({ feedId }: { feedId: string }) => {
  const { transpont } = useFeedTranspont()
  const userStore = useUserStore((state) => state.user)
  const atTextRef = useRef<AtTextareaRef>(null)
  const [textCount, setTextCount] = useState(0)

  const form = useForm<FeedTranspontForm>({
    resolver: zodResolver(feedTranspontSchema),
    defaultValues: {
      content: '转发动态',
      feedId,
    },
  })

  const onSubmit = async (data: FeedTranspontForm) => {
    data.content = atTextRef.current?.getEditor()?.getText() || '转发动态'
    const { code } = await transpont(data)
    if (code) return
    form.reset()
    setTextCount(0)
    toast('转发成功')
  }

  return (
    <div className={'pl-16'}>
      <div className={'pt-3 relative pb-2.5 pl-10'}>
        <div className={'rounded-full size-8 absolute top-3 left-0 cursor-default'}>
          {userStore && <UserAvatar avatar={userStore?.avatar} h={32} w={32} />}
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (errors) => {
              const message = (errors.feedId?.message ?? '') + (errors.content?.message ?? '')
              if (message) toast(message)
            })}
          >
            <FormField
              control={form.control}
              name='content'
              render={() => (
                <FormItem>
                  <div
                    className={cn(
                      'border border-line_regular hover:border-brand_blue rounded-[4px] min-h-20 w-full relative'
                    )}
                  >
                    <div
                      className={cn(
                        'max-h-[220px] pr-[5px] pt-2.5 pl-[14px] cursor-text size-full overflow-y-auto relative'
                      )}
                    >
                      {!textCount && (
                        <div
                          className={
                            'text-sm absolute top-2.5 left-[14px] z-2 pointer-events-none leading-5 text-text3'
                          }
                        >
                          请自觉遵守互联网相关的政策法规，严禁发布色情、暴力、反动的言论。
                        </div>
                      )}
                      <FormControl>
                        <AtTextarea
                          ref={atTextRef}
                          onUpdate={(count) => {
                            setTextCount(count)
                          }}
                          className={cn(
                            'text-sm leading-5 min-h-5 text-text1 bg-bg1 tracking-[1px] pr-[5px]'
                          )}
                        />
                      </FormControl>
                    </div>
                  </div>
                </FormItem>
              )}
            />

            <div className={'flex items-center h-[30px] mt-2 w-full justify-between'}>
              <div className={'flex items-center'}></div>
              <div>
                <span className={'text-text3 text-[13px] mr-4'}>{1000 - textCount}</span>
                <Button
                  type='submit'
                  className={
                    'bg-brand_blue rounded-[6px] text-white text-sm cursor-pointer h-[30px] leading-[30px] px-[15px] transition-opacity duration-200 hover:opacity-80 opacity-100'
                  }
                >
                  转发
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default FeedTranspontContent
