'use client'

import { Editor, EditorContent, useEditor } from '@tiptap/react'
import { cn } from '@/lib'
import { CharacterCount } from '@tiptap/extensions'
import Paragraph from '@tiptap/extension-paragraph'
import Document from '@tiptap/extension-document'
import Text from '@tiptap/extension-text'
import Mention from '@tiptap/extension-mention'
import suggesstion from '@/components/layout/at/suggesstion'
import { Ref, useImperativeHandle } from 'react'

export type AtTextareaRef = {
  getTextCount: () => number
  insertImage: (url: string, alt?: string) => void
  getEditor: () => Editor | null
  insertMention: () => void
  reset: () => void
}

const AtTextarea = ({
  ref,
  onUpdate,
  className,
  pClassName,
}: {
  ref?: Ref<AtTextareaRef> | null
  onUpdate?: (count: number, html: string) => void
  className?: string
  pClassName?: string
}) => {
  const editor = useEditor({
    extensions: [
      Document.configure({}),
      Paragraph.configure({
        HTMLAttributes: {
          class: cn(pClassName),
        },
      }),
      Text.configure({}),
      CharacterCount.configure({
        limit: 1000,
      }),
      Mention.configure({
        HTMLAttributes: {
          class: 'text-brand_blue rounded-[4px] cursor-pointer',
        },
        suggestion: suggesstion,

        renderHTML: ({ node }) => {
          return [
            'a',
            {
              class: 'text-brand_blue rounded-[4px] cursor-pointer',
              'data-id': node.attrs.id,
              href: `/space/${node.attrs.id}`,
              target: '_blank',
            },
            `@${node.attrs.label}`,
          ]
        },
        deleteTriggerWithBackspace: true,
      }),
    ],
    // Don't render immediately on the server to avoid SSR issues
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: cn(
          'focus:outline-none overflow-y-auto overflow-x-hidden break-words break-all',
          className
        ),
      },
      handlePaste: (view, event) => {
        const text = event.clipboardData?.getData('text/plain')
        if (text && editor) {
          // 粘贴为纯文本，不生成新的 <p>
          editor.chain().focus().insertContent(text).run()
          return true // 阻止默认粘贴行为
        }
        return false
      },
    },
  })

  editor?.on('update', () => {
    const count = editor.storage.characterCount.characters()
    const html = editor.getHTML()
    onUpdate?.(count, html)
  })

  useImperativeHandle(ref, () => ({
    getTextCount: () => editor?.storage.characterCount.characters() ?? 0,
    insertImage: (url: string, alt = '') => {
      if (!editor) return
      editor.chain().focus().insertContent(`<img src="${url}" alt="${alt}" />`).run()
    },
    getEditor: () => editor,
    insertMention: () => {
      if (!editor) return
      const { state } = editor
      const { from } = state.selection
      const textBefore = state.doc.textBetween(Math.max(0, from - 1), from, undefined, '\0')

      // 如果光标不是在开头，且前一个字符不是空格，则先插入空格
      if (from > 0 && textBefore !== ' ') {
        editor.chain().focus().insertContent(' ').run()
      }
      editor.chain().focus().insertContent('@').run()
    },
    reset: () => {
      if (!editor) return
      editor.commands.clearContent()
    },
  }))

  return <EditorContent editor={editor} />
}

export default AtTextarea
