import { computePosition, flip, shift } from '@floating-ui/dom'
import { Editor, posToDOMRect, ReactRenderer } from '@tiptap/react'
import { SuggestionOptions, SuggestionProps } from '@tiptap/suggestion'

import MentionList from './MetionList'
import { getUserAtList } from '@/services'
import {
  MentionItem,
  MentionListProps,
  MentionListRef,
} from '@/components/layout/at/MentionListRef' // 定义 MentionItem 类型

// 定义 MentionItem 类型

// 负责浮动定位
const updatePosition = (editor: Editor, element: HTMLElement) => {
  const virtualElement = {
    getBoundingClientRect: () =>
      posToDOMRect(editor.view, editor.state.selection.from, editor.state.selection.to),
  }

  computePosition(virtualElement, element, {
    placement: 'bottom-start',
    strategy: 'absolute',
    middleware: [shift(), flip()],
  }).then(({ x, y, strategy }) => {
    element.style.width = 'max-content'
    element.style.position = strategy
    element.style.left = `${x}px`
    element.style.top = `${y}px`
  })
}

const mentionSuggestion: Omit<SuggestionOptions<MentionItem>, 'editor'> = {
  items: async ({ query }): Promise<MentionItem[]> => {
    const { data: atList } = await getUserAtList({ page: 1, pageSize: 200, keyword: query })
    return atList?.list ?? []
  },

  render: () => {
    let component: ReactRenderer<MentionListRef, MentionListProps> | null = null

    return {
      onStart: (props: SuggestionProps<MentionItem>) => {
        component = new ReactRenderer(MentionList, {
          editor: props.editor,
          props,
        })

        if (!props.clientRect) return

        const el = component.element
        el.style.position = 'absolute'
        el.style.zIndex = '10001'

        document.body.appendChild(el)

        component?.updateProps(props)

        updatePosition(props.editor, el)
      },

      onUpdate(props: SuggestionProps<MentionItem>) {
        component?.updateProps(props)

        if (!props.clientRect) return

        updatePosition(props!.editor, component!.element)
      },

      onKeyDown(props) {
        if (props.event.key === 'Escape') {
          component?.destroy()
          return true
        }

        return component?.ref?.onKeyDown({ event: props.event }) ?? false
      },

      onExit() {
        if (component) {
          component.element.remove()
          component.destroy()
          component = null
        }
      },
      onSelect: (item: MentionItem, editor: Editor) => {
        editor
          .chain()
          .focus()
          .insertContent({
            type: 'mention',
            attrs: {
              id: item.id,
              label: item.name, // 存 name，用于显示
            },
          })
          .run()
        // 关闭悬浮列表
        component?.destroy()
      },
    }
  },
}

export default mentionSuggestion
