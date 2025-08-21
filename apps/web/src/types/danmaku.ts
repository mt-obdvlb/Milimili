import { DanmakuPosition } from '@mtobdvlb/shared-types'

export type DanmakuGetItem = {
  content: string
  time: number
  position: DanmakuPosition
  color: string
  id: string
}

export type DanmakuGetResult = DanmakuGetItem[]
