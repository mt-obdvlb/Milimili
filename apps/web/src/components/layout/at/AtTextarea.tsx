// AtTextarea.tsx
'use client'

import { Editor, EditorContent, useEditor } from '@tiptap/react'
import { cn } from '@/lib'
import { CharacterCount } from '@tiptap/extensions'
import Paragraph from '@tiptap/extension-paragraph'
import Document from '@tiptap/extension-document'
import Text from '@tiptap/extension-text'
import Mention from '@tiptap/extension-mention'
import suggesstion from '@/components/layout/at/suggesstion'
import { Ref, useEffect, useImperativeHandle } from 'react'

export type AtTextareaRef = {
  getTextCount: () => number
  insertImage: (url: string, alt?: string) => void
  getEditor: () => Editor | null
  insertMention: () => void
  reset: () => void
}

const escapeHtml = (unsafe: string) =>
  unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')

const ensureHtml = (maybeHtml: string) => {
  if (!maybeHtml) return ''
  // 简单 heuristic：如果包含 <> 则当作 HTML，否则转为简单的段落
  if (/<[a-z][\s\S]*>/i.test(maybeHtml)) return maybeHtml
  // 转义并换行为 <p>...<br/></p>
  const lines = maybeHtml.split(/\r?\n/).map((l) => `<p>${escapeHtml(l)}</p>`)
  return lines.join('')
}

const AtTextarea = ({
  ref,
  onUpdate,
  onReady,
  className,
  pClassName,
  content = '', // 新增 prop：初始/受控内容（可为空字符串）
}: {
  ref?: Ref<AtTextareaRef> | null
  onUpdate?: (count: number, html: string) => void
  onReady?: (editor: Editor) => void
  className?: string
  pClassName?: string
  content?: string
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
          editor.chain().focus().insertContent(escapeHtml(text)).run()
          return true
        }
        return false
      },
    },
    // lifecycle callbacks
    onCreate: ({ editor }) => {
      onReady?.(editor)
    },
    onUpdate: ({ editor }) => {
      const count = editor.storage.characterCount.characters()
      const html = editor.getHTML()
      onUpdate?.(count, html)
    },
  })

  // 当 editor 就绪或 content 改变时，智能同步内容到 editor（只在确实不同且 editor 存在时）
  useEffect(() => {
    if (!editor) return
    const nextHtml = ensureHtml(content)
    const currentHtml = editor.getHTML?.() ?? ''
    // 避免重复 setContent（会重置光标/历史）
    if (nextHtml.trim() === '' && currentHtml.trim() === '') return
    if (nextHtml === currentHtml) return
    // 使用 setContent 替换当前内容（因为我们在确实不同的情况下才调用）
    editor.commands.setContent(nextHtml)
    // 之后不强制聚焦或移动光标
  }, [editor, content])

  // 保留原有的 on('update') 方案也行，但我们已用 onUpdate prop above

  useImperativeHandle(ref, () => ({
    getTextCount: () => editor?.storage.characterCount.characters() ?? 0,
    insertImage: (url: string, alt = '') => {
      if (!editor) return
      editor
        .chain()
        .focus()
        .insertContent(`<img src="${url}" alt="${escapeHtml(alt)}" />`)
        .run()
    },
    getEditor: () => editor ?? null,
    insertMention: () => {
      if (!editor) return
      const { state } = editor
      const { from } = state.selection
      const textBefore = state.doc.textBetween(Math.max(0, from - 1), from, undefined, '\0')
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
