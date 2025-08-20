import { DanmakuPosition } from '@mtobdvlb/shared-types'

export type DanmakuGetItem = {
  content: string
  time: number
  position: DanmakuPosition
}

export type DanmkauGetResponse = DanmakuGetItem[]
