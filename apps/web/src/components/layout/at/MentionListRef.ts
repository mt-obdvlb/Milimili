// MentionListRef.ts
import type { Ref } from 'react'
import { UserAtItem } from '@mtobdvlb/shared-types'

export type MentionItem = UserAtItem

export interface MentionListRef {
  /**
   * 用于处理键盘事件（上/下箭头、回车等）
   * @param props.event - 原生 KeyboardEvent
   * @returns 是否阻止默认事件（true 表示已处理）
   */
  onKeyDown: (props: { event: globalThis.KeyboardEvent }) => boolean
}

/**
 * MentionListProps 类型
 */
export interface MentionListProps {
  items: MentionItem[]
  command: (item: { id: string; label: string }) => void
  ref?: Ref<MentionListRef>
}
