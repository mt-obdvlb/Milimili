'use client'

import { useRef, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components'
import AtTextarea, { AtTextareaRef } from '@/components/layout/at/AtTextarea'
import { cn, toast } from '@/lib'
import { useComment } from '@/features'
import { CommentDTO, commentDTO } from '@mtobdvlb/shared-types'

import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'

const commentPublishSchema = commentDTO
type CommentPublishForm = z.infer<typeof commentPublishSchema>

const CommentPublish = ({
  commentId,
  videoId,
  feedId,
  name,
}: Pick<CommentDTO, 'commentId' | 'feedId' | 'videoId'> & {
  name?: string
  mainCommentId?: string
}) => {
  const atTextRef = useRef<AtTextareaRef>(null)
  const [textCount, setTextCount] = useState(0)
  const { comment } = useComment()

  const form = useForm<CommentPublishForm>({
    resolver: zodResolver(commentPublishSchema),
    defaultValues: { content: '' },
    mode: 'onChange',
  })

  const onSubmit = async (data: CommentPublishForm) => {
    data.content = name
      ? `回复 @${name} : ` + (atTextRef.current?.getEditor()?.getText() ?? '')
      : (atTextRef.current?.getEditor()?.getText() ?? '')
    const { code } = await comment({
      content: data.content,
      commentId,
      feedId,
      videoId,
    })
    if (code) return
    form.reset()
    atTextRef.current?.reset()
    toast('已评论')
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, (errors) => {
          const msg = errors.content?.message
          toast(msg || '提交失败')
        })}
        className={'relative w-[calc(100%-80px)]'}
      >
        <div className={'w-full peer transition-[height] duration-200'}>
          <div
            className={
              'w-full py-2 border border-[var(--Ga1)] rounded-[6px] hover:bg-bg1 hover:border-graph_weak has-focus:bg-bg1 has-focus:border-graph_weak bg-bg3 transition duration-200 cursor-text '
            }
          >
            <div className={'min-h-8 max-h-25 leading-8 w-full text-sm text-text1 relative'}>
              {!textCount && (
                <div
                  className={
                    'absolute left-2 top-0 h-8 text-text3 flex items-center justify-center text-sm leading-5 pointer-events-none'
                  }
                >
                  {name
                    ? `回复 @${name} :`
                    : ['你猜我的评论区在等待谁？', 'wifi连接中......检测到粉丝评论输出电波......'][
                        Math.floor(Math.random() * 2)
                      ]}
                </div>
              )}
              <FormField
                control={form.control}
                name='content'
                render={() => (
                  <FormItem className='m-0 p-0'>
                    <FormControl>
                      <AtTextarea
                        className={cn(
                          'px-2 text-sm leading-5 min-h-5  max-h-25',
                          !textCount && 'h-8 leading-8'
                        )}
                        ref={atTextRef}
                        onUpdate={(count, html) => {
                          setTextCount(count)
                          form.setValue('content', html)
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <div
          className={cn(
            'relative mt-2.5 flex items-center',
            !textCount && !name && 'peer-not-has-focus:hidden '
          )}
        >
          <Button
            className={cn(
              'outline-none flex justify-center items-center relative w-8 h-[26px] border border-[var(--Ga1)] bg-bg1 rounded-[4px] text-text2 cursor-pointer mr-1.5'
            )}
            type={'button'}
            onMouseDown={() => {
              atTextRef.current?.insertMention()
            }}
          >
            {/* SVG icon */}
            <svg
              id='icon'
              xmlns='http://www.w3.org/2000/svg'
              width='16'
              height='16'
              viewBox='0 0 16 16'
            >
              <path
                d='M7.571333333333333 5.642906666666666C6.5793133333333325 5.642906666666666 5.642753333333333 6.618966666666666 5.642753333333333 8.000066666666665C5.642753333333333 9.381133333333333 6.5793133333333325 10.357199999999999 7.571333333333333 10.357199999999999C8.563333333333333 10.357199999999999 9.499866666666666 9.381133333333333 9.499866666666666 8.000066666666665C9.499866666666666 6.618966666666666 8.563333333333333 5.642906666666666 7.571333333333333 5.642906666666666zM4.642753333333333 8.000066666666665C4.642753333333333 6.225226666666666 5.8808066666666665 4.642906666666667 7.571333333333333 4.642906666666667C9.261833333333332 4.642906666666667 10.499866666666666 6.225226666666666 10.499866666666666 8.000066666666665C10.499866666666666 9.774866666666666 9.261833333333332 11.357199999999999 7.571333333333333 11.357199999999999C5.8808066666666665 11.357199999999999 4.642753333333333 9.774866666666666 4.642753333333333 8.000066666666665z'
                fill='currentColor'
              ></path>

              <path
                d='M10.142933333333332 4.928546666666667C10.4191 4.928546666666667 10.642933333333332 5.152406666666666 10.642933333333332 5.428546666666667L10.642933333333332 9.2252C10.642933333333332 9.942633333333333 11.248999999999999 10.398666666666667 11.991566666666666 10.313733333333332C12.674966666666666 10.235533333333333 13.5227 9.639933333333332 13.621933333333333 8.034233333333333C13.639 7.7585999999999995 13.876199999999999 7.548966666666666 14.151833333333332 7.566033333333333C14.427433333333333 7.5830666666666655 14.637066666666666 7.8203 14.620033333333334 8.095933333333333C14.496433333333332 10.095066666666666 13.355166666666666 11.164233333333332 12.105233333333333 11.307233333333333C10.914533333333333 11.443466666666666 9.642933333333332 10.677233333333334 9.642933333333332 9.2252L9.642933333333332 5.428546666666667C9.642933333333332 5.152406666666666 9.866833333333332 4.928546666666667 10.142933333333332 4.928546666666667z'
                fill='currentColor'
              ></path>

              <path
                d='M8 2.375C4.8934 2.375 2.375 4.8934 2.375 8C2.375 11.1066 4.8934 13.625 8 13.625C9.132133333333332 13.625 10.184733333333334 13.291066666666666 11.066533333333332 12.716433333333331C11.2979 12.5657 11.607666666666667 12.631033333333331 11.758433333333333 12.862400000000001C11.909166666666666 13.093733333333333 11.843833333333333 13.403533333333332 11.612466666666666 13.5543C10.5732 14.231499999999999 9.3318 14.625 8 14.625C4.3411133333333325 14.625 1.375 11.6589 1.375 8C1.375 4.3411133333333325 4.3411133333333325 1.375 8 1.375C11.6589 1.375 14.625 4.3411133333333325 14.625 8C14.625 8.276133333333332 14.401133333333334 8.5 14.125 8.5C13.848866666666666 8.5 13.625 8.276133333333332 13.625 8C13.625 4.8934 11.1066 2.375 8 2.375z'
                fill='currentColor'
              ></path>
            </svg>
          </Button>

          <div className={'h-8 w-[70px] ml-auto'}>
            <Button
              type={'submit'}
              className={cn(
                'bg-brand_blue cursor-pointer rounded-[4px] size-full text-[16px] text-white',
                !textCount && 'opacity-50'
              )}
              disabled={!textCount}
            >
              发布
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}

export default CommentPublish
