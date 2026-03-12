export type DanmakuPosition = 'top' | 'bottom' | 'scroll'

export type DanmakuMode = DanmakuPosition

export type DanmakuSender = {
  userId: string
  name: string
  avatar: string
}

export type DanmakuItem = {
  id: string
  videoId: string
  content: string
  time: number
  position: DanmakuPosition
  mode: DanmakuMode
  color: string
  fontSize: number
  createdAt: string
  sender: DanmakuSender
}

export type DanmakuPlayerModeFilter = 'all' | DanmakuMode

export type DanmakuPlayerConfig = {
  visible: boolean
  modeFilter: DanmakuPlayerModeFilter
  opacity: number
  fontScale: number
  areaRatio: number
  speed: number
  density: number
  smartMask: boolean
}
