type DanmakuTrack = 'scroll' | 'top' | 'bottom'

export type NativeDanmakuItem = {
  id: string
  text: string
  stime: number
  size?: number
  color?: number
  priority?: number
}

type ActiveDanmaku = {
  id: string
  el: HTMLDivElement
  lane: number
  x: number
  y: number
  width: number
  speed: number
  duration: number
  elapsed: number
}

type NativeDanmakuOptions = {
  global: {
    scale: number
    opacity: number
    areaRatio: number
    speed: number
    density: number
  }
}

const FIXED_DURATION = 4
const SCROLL_BASE_DURATION = 8
const PRELOAD_WINDOW = 0.12
const SEEK_THRESHOLD = 0.8

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(value, max))

export class NativeDanmakuEngine {
  public readonly options: NativeDanmakuOptions = {
    global: {
      scale: 1,
      opacity: 1,
      areaRatio: 0.7,
      speed: 1,
      density: 1,
    },
  }

  private readonly stage: HTMLDivElement
  private readonly track: DanmakuTrack
  private readonly timeline: NativeDanmakuItem[] = []
  private readonly active: ActiveDanmaku[] = []
  private laneAvailableAt: number[] = []
  private currentTime = 0
  private pointer = 0
  private running = false
  private rafId: number | null = null
  private lastFrameTs = 0
  private playClock = 0
  private resizeObserver: ResizeObserver | null = null
  private playbackRate = 1

  constructor(stage: HTMLDivElement, track: DanmakuTrack) {
    this.stage = stage
    this.track = track
  }

  init() {
    this.stage.style.position = 'absolute'
    this.stage.style.inset = '0'
    this.stage.style.overflow = 'hidden'
    this.stage.style.pointerEvents = 'none'
    this.stage.style.userSelect = 'none'
    this.refreshLanes()
    this.resizeObserver = new ResizeObserver(() => this.refreshLanes())
    this.resizeObserver.observe(this.stage)
  }

  setConfig(config: Partial<NativeDanmakuOptions['global']>) {
    this.options.global = {
      ...this.options.global,
      ...config,
    }
    this.refreshLanes()
    for (const item of this.active) {
      item.el.style.opacity = `${clamp(this.options.global.opacity, 0.2, 1)}`
    }
  }

  setPlaybackRate(rate: number) {
    this.playbackRate = clamp(rate || 1, 0.25, 4)
  }

  start() {
    if (this.running) return
    this.running = true
    this.lastFrameTs = 0
    this.rafId = requestAnimationFrame(this.tick)
  }

  stop() {
    this.running = false
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId)
      this.rafId = null
    }
  }

  clear() {
    for (const item of this.active) {
      item.el.remove()
    }
    this.active.length = 0
    this.pointer = 0
    this.laneAvailableAt = this.laneAvailableAt.map(() => 0)
  }

  destroy() {
    this.stop()
    this.clear()
    this.timeline.length = 0
    this.resizeObserver?.disconnect()
    this.resizeObserver = null
  }

  load(data: NativeDanmakuItem[]) {
    this.timeline.length = 0
    for (const item of data) this.timeline.push(item)
    this.timeline.sort(
      (a, b) =>
        a.stime - b.stime || (b.priority ?? 0) - (a.priority ?? 0) || a.id.localeCompare(b.id)
    )
    this.seekTo(this.currentTime)
  }

  send(item: NativeDanmakuItem) {
    const index = this.lowerBound(item.stime)
    this.timeline.splice(index, 0, item)
    if (item.stime <= this.currentTime + PRELOAD_WINDOW) {
      if (this.tryEmitOne(item)) {
        this.pointer = Math.max(this.pointer, index + 1)
      }
    }
  }

  time(t: number) {
    if (!Number.isFinite(t) || t < 0) return
    if (Math.abs(t - this.currentTime) > SEEK_THRESHOLD) {
      this.seekTo(t)
      return
    }
    this.currentTime = t
  }

  setBounds() {
    this.refreshLanes()
  }

  private readonly tick = (ts: number) => {
    if (!this.running) return

    if (!this.lastFrameTs) this.lastFrameTs = ts
    const delta = Math.min((ts - this.lastFrameTs) / 1000, 0.1)
    this.lastFrameTs = ts
    this.playClock += delta * this.playbackRate

    this.emitDueDanmaku()
    this.updateActive(delta)

    this.rafId = requestAnimationFrame(this.tick)
  }

  private emitDueDanmaku() {
    while (this.pointer < this.timeline.length) {
      const current = this.timeline[this.pointer]
      if (!current) break
      if (current.stime > this.currentTime + PRELOAD_WINDOW) break
      if (!this.tryEmitOne(current)) break
      this.pointer += 1
    }
  }

  private tryEmitOne(item: NativeDanmakuItem) {
    if (this.active.length >= this.getActiveLimit()) return false
    if (!this.emitOne(item)) return false
    return true
  }

  private emitOne(item: NativeDanmakuItem) {
    const text = item.text?.trim()
    if (!text) return

    const scale = this.options.global.scale || 1
    const fontSize = (item.size || 24) * scale
    const width = this.stage.clientWidth
    const height = this.stage.clientHeight
    if (!width || !height) return

    const el = document.createElement('div')
    el.dataset.danmakuId = item.id
    el.textContent = text
    el.style.position = 'absolute'
    el.style.whiteSpace = 'nowrap'
    el.style.fontSize = `${fontSize}px`
    el.style.lineHeight = '1.25'
    el.style.fontWeight = '700'
    el.style.textShadow = '0 0 2px rgba(0,0,0,0.9), 0 1px 2px rgba(0,0,0,0.75)'
    el.style.color = this.toHexColor(item.color)
    el.style.opacity = `${clamp(this.options.global.opacity, 0.2, 1)}`
    el.style.transform = 'translate3d(-9999px,-9999px,0)'
    el.style.willChange = 'transform'
    this.stage.appendChild(el)

    const measuredWidth = Math.max(el.offsetWidth, 1)
    const lane = this.pickLane(measuredWidth)
    if (lane === -1) {
      el.remove()
      return false
    }
    const laneHeight = Math.max(fontSize * 1.45, 28)
    const usableHeight = Math.max(height * clamp(this.options.global.areaRatio, 0.2, 1), laneHeight)
    const trackTop = this.track === 'bottom' ? Math.max(height - usableHeight, 0) : 0
    const y =
      this.track === 'bottom'
        ? Math.max(trackTop + usableHeight - (lane + 1) * laneHeight, 0)
        : Math.min(trackTop + lane * laneHeight, Math.max(height - laneHeight, 0))

    const speedRatio = clamp(this.options.global.speed, 0.5, 2)
    const densityRatio = clamp(this.options.global.density, 0.5, 2)
    if (this.track === 'scroll') {
      const textFactor = Math.min(measuredWidth / 320, 0.45)
      const duration = Math.max((SCROLL_BASE_DURATION - textFactor) / speedRatio, 3.8)
      const speed = (width + measuredWidth) / duration
      const laneGap = Math.min((duration * 0.45) / densityRatio, 2.5)
      this.laneAvailableAt[lane] = this.playClock + laneGap
      this.active.push({
        id: item.id,
        el,
        lane,
        x: width,
        y,
        width: measuredWidth,
        speed,
        duration,
        elapsed: 0,
      })
      return true
    }

    const x = (width - measuredWidth) / 2
    const duration = FIXED_DURATION / speedRatio
    this.laneAvailableAt[lane] = this.playClock + duration * 0.9
    this.active.push({
      id: item.id,
      el,
      lane,
      x,
      y,
      width: measuredWidth,
      speed: 0,
      duration,
      elapsed: 0,
    })
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`
    return true
  }

  private updateActive(delta: number) {
    for (let i = this.active.length - 1; i >= 0; i -= 1) {
      const item = this.active[i]
      if (!item) continue
      item.elapsed += delta * this.playbackRate

      if (this.track === 'scroll') {
        item.x -= item.speed * delta * this.playbackRate
        if (item.x + item.width < 0) {
          item.el.remove()
          this.active.splice(i, 1)
          continue
        }
        item.el.style.transform = `translate3d(${item.x}px, ${item.y}px, 0)`
        continue
      }

      if (item.elapsed >= item.duration) {
        item.el.remove()
        this.active.splice(i, 1)
      }
    }
  }

  private seekTo(time: number) {
    this.currentTime = time
    for (const item of this.active) {
      item.el.remove()
    }
    this.active.length = 0
    this.laneAvailableAt = this.laneAvailableAt.map(() => 0)
    this.pointer = this.lowerBound(time)
  }

  private refreshLanes() {
    const stageHeight = this.stage.clientHeight
    const scale = this.options.global.scale || 1
    const laneHeight = Math.max(28 * scale, 24)
    const usableHeight = Math.max(
      stageHeight * clamp(this.options.global.areaRatio, 0.2, 1),
      laneHeight
    )
    const laneCount = Math.max(Math.floor(usableHeight / laneHeight), 1)
    this.laneAvailableAt = new Array(laneCount).fill(0)
  }

  private getActiveLimit() {
    const densityRatio = clamp(this.options.global.density, 0.5, 2)
    return Math.max(Math.ceil(this.laneAvailableAt.length * densityRatio), 1)
  }

  private pickLane(nextWidth: number) {
    if (this.laneAvailableAt.length === 0) {
      this.refreshLanes()
    }
    let lane = 0
    let minAvailableAt = this.laneAvailableAt[0] ?? 0

    for (let i = 0; i < this.laneAvailableAt.length; i += 1) {
      const availableAt = this.laneAvailableAt[i] ?? 0
      if (availableAt <= this.playClock && this.canUseLane(i, nextWidth)) return i
      if (availableAt < minAvailableAt) {
        minAvailableAt = availableAt
        lane = i
      }
    }

    return this.canUseLane(lane, nextWidth) ? lane : -1
  }

  private canUseLane(lane: number, nextWidth: number) {
    const laneItems = this.active.filter((item) => item.lane === lane)
    if (laneItems.length === 0) return true

    if (this.track !== 'scroll') {
      return laneItems.every((item) => item.elapsed >= item.duration * 0.92)
    }

    const lastItem = laneItems.reduce((latest, current) =>
      current.x > latest.x ? current : latest
    )
    const minGap = Math.max(Math.min(nextWidth * 0.12, 48), 20)
    return lastItem.x + lastItem.width <= this.stage.clientWidth - minGap
  }

  private lowerBound(stime: number) {
    let left = 0
    let right = this.timeline.length
    while (left < right) {
      const mid = (left + right) >> 1
      const value = this.timeline[mid]?.stime ?? 0
      if (value < stime) left = mid + 1
      else right = mid
    }
    return left
  }

  private toHexColor(color?: number) {
    const safe = Number.isFinite(color)
      ? Math.max(0, Math.min(color as number, 0xffffff))
      : 0xffffff
    return `#${Math.round(safe).toString(16).padStart(6, '0')}`
  }
}
