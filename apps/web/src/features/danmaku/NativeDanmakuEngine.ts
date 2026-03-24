import { toast } from '@/lib'

type DanmakuTrack = 'scroll' | 'top' | 'bottom'

export type NativeDanmakuItem = {
  id: string
  text: string
  stime: number
  size?: number
  color?: number
}

type ActiveDanmaku = {
  id: string
  text: string
  el: HTMLDivElement
  lane: number
  x: number
  y: number
  width: number
  speed: number
  duration: number
  elapsed: number
  paused: boolean
}

type NativeDanmakuOptions = {
  global: {
    scale: number
    opacity: number
    areaRatio: number
    speed: number
    density: number
    hoverable: boolean
  }
}

const FIXED_DURATION = 4
const SCROLL_BASE_DURATION = 6.4
const BASE_LANE_HEIGHT = 24
const PRELOAD_WINDOW = 0.12
const PENDING_EXPIRE_WINDOW = 5
const SEEK_THRESHOLD = 0.8
const MIN_SAFE_GAP = 50

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(value, max))

export class NativeDanmakuEngine {
  public readonly options: NativeDanmakuOptions = {
    global: {
      scale: 1,
      opacity: 1,
      areaRatio: 0.7,
      speed: 1,
      density: 1,
      hoverable: true,
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
  private stageWidth = 0
  private stageHeight = 0
  private tooltipEl: HTMLDivElement | null = null
  private tooltipCopyTriggerEl: HTMLElement | null = null
  private hoveredItemId: string | null = null
  private hideTooltipTimer: number | null = null

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
    this.stageWidth = this.stage.clientWidth
    this.stageHeight = this.stage.clientHeight
    this.refreshLanes()
    this.resizeObserver = new ResizeObserver(() => this.handleStageResize())
    this.resizeObserver.observe(this.stage)
  }

  setConfig(config: Partial<NativeDanmakuOptions['global']>) {
    this.options.global = {
      ...this.options.global,
      ...config,
    }
    if (!this.isHoverEnabled()) {
      this.hideHoveredItem(true)
    }
    this.refreshLanes()
    for (const item of this.active) {
      item.el.style.opacity = `${clamp(this.options.global.opacity, 0.2, 1)}`
      item.el.style.pointerEvents = this.isHoverEnabled() ? 'auto' : 'none'
      item.el.style.cursor = this.isHoverEnabled() ? 'pointer' : 'default'
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
    this.hideHoveredItem(true)
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
    this.destroyTooltip()
  }

  setTooltipElement(element: HTMLDivElement | null) {
    if (this.tooltipEl === element) return
    this.destroyTooltip()
    this.tooltipEl = element
    if (!this.tooltipEl) return
    this.tooltipEl.style.position = 'absolute'
    this.tooltipEl.style.left = '0px'
    this.tooltipEl.style.top = '0px'
    this.tooltipEl.style.visibility = 'hidden'
    this.tooltipEl.style.pointerEvents = 'auto'
    this.tooltipCopyTriggerEl = this.tooltipEl.querySelector('[data-danmaku-tooltip-copy="true"]')
    this.tooltipEl.addEventListener('mouseenter', this.handleTooltipMouseEnter)
    this.tooltipEl.addEventListener('mouseleave', this.handleTooltipMouseLeave)
    this.tooltipCopyTriggerEl?.addEventListener('click', this.handleTooltipClick)
    this.updateTooltipDirection('top')
  }

  load(data: NativeDanmakuItem[]) {
    this.timeline.length = 0
    for (const item of data) this.timeline.push(item)
    this.timeline.sort((a, b) => a.stime - b.stime || a.id.localeCompare(b.id))
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
    this.handleStageResize()
  }

  private readonly handleTooltipMouseEnter = () => this.clearHideTooltipTimer()

  private readonly handleTooltipMouseLeave = () => this.scheduleHideHoveredItem()

  private readonly handleTooltipClick = () => void this.copyHoveredDanmaku()

  private handleStageResize() {
    const nextWidth = this.stage.clientWidth
    const nextHeight = this.stage.clientHeight
    if (nextWidth === this.stageWidth && nextHeight === this.stageHeight) return

    this.stageWidth = nextWidth
    this.stageHeight = nextHeight
    this.refreshLanes()

    if (!nextWidth || !nextHeight) return
    // Resize/fullscreen toggle 后用当前时间重建，避免旧尺寸坐标残留。
    this.seekTo(this.currentTime)
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
      if (this.isActive(current.id)) {
        this.pointer += 1
        continue
      }
      if (this.currentTime - current.stime > PENDING_EXPIRE_WINDOW) {
        this.pointer += 1
        continue
      }
      if (!this.tryEmitOne(current)) break
      this.pointer += 1
    }
  }

  private tryEmitOne(item: NativeDanmakuItem) {
    if (this.track !== 'scroll' && this.active.length >= this.getActiveLimit()) return false
    return this.emitOne(item)
  }

  private emitOne(item: NativeDanmakuItem) {
    const text = item.text?.trim()
    if (!text) return

    const scale = this.options.global.scale || 1
    const fontSize = (item.size || 24) * scale
    const laneHeight = this.getLaneHeight()
    const width = this.stage.clientWidth
    const height = this.stage.clientHeight
    if (!width || !height) return

    const el = document.createElement('div')
    el.dataset.danmakuId = item.id
    el.textContent = text
    el.style.position = 'absolute'
    el.style.whiteSpace = 'nowrap'
    el.style.fontSize = `${fontSize}px`
    el.style.lineHeight = `${laneHeight}px`
    el.style.fontWeight = '700'
    el.style.textShadow = '0 0 2px rgba(0,0,0,0.9), 0 1px 2px rgba(0,0,0,0.75)'
    el.style.color = this.toHexColor(item.color)
    el.style.opacity = `${clamp(this.options.global.opacity, 0.1, 1)}`
    el.style.transform = 'translate3d(-9999px,-9999px,0)'
    el.style.willChange = 'transform'
    el.style.pointerEvents = this.isHoverEnabled() ? 'auto' : 'none'
    el.style.cursor = this.isHoverEnabled() ? 'pointer' : 'default'
    this.stage.appendChild(el)
    this.bindHoverEvents(el, item.id)

    const measuredWidth = Math.max(el.offsetWidth, 1)
    const { top: trackTop, usableHeight } = this.getTrackMetrics(height, laneHeight)

    const speedRatio = clamp(this.options.global.speed, 0.5, 2)
    const densityRatio = clamp(this.options.global.density, 0.5, 2)
    if (this.track === 'scroll') {
      const speed = this.getScrollSpeed(width, speedRatio, measuredWidth)
      const duration = (width + measuredWidth) / speed
      const lane = this.pickLane(measuredWidth, speed)
      if (lane === -1) {
        el.remove()
        return false
      }
      const scrollY = Math.min(
        trackTop + lane * laneHeight,
        Math.max(trackTop + usableHeight - laneHeight, 0)
      )
      const laneGap = Math.max(
        this.getMinGap(measuredWidth) / Math.max(speed * densityRatio, 1),
        0.04
      )
      this.laneAvailableAt[lane] = this.playClock + laneGap
      this.active.push({
        id: item.id,
        text,
        el,
        lane,
        x: width,
        y: scrollY,
        width: measuredWidth,
        speed,
        duration,
        elapsed: 0,
        paused: false,
      })
      return true
    }

    const x = (width - measuredWidth) / 2
    const duration = FIXED_DURATION / speedRatio
    const lane = this.pickLane(measuredWidth, 0)
    if (lane === -1) {
      el.remove()
      return false
    }
    const fixedY =
      this.track === 'bottom'
        ? Math.max(trackTop + usableHeight - (lane + 1) * laneHeight, 0)
        : Math.min(trackTop + lane * laneHeight, Math.max(trackTop + usableHeight - laneHeight, 0))
    this.laneAvailableAt[lane] = this.playClock + duration * 0.9
    this.active.push({
      id: item.id,
      text,
      el,
      lane,
      x,
      y: fixedY,
      width: measuredWidth,
      speed: 0,
      duration,
      elapsed: 0,
      paused: false,
    })
    el.style.transform = `translate3d(${x}px, ${fixedY}px, 0)`
    return true
  }

  private updateActive(delta: number) {
    for (let i = this.active.length - 1; i >= 0; i -= 1) {
      const item = this.active[i]
      if (!item) continue
      if (item.paused) {
        if (this.hoveredItemId === item.id) {
          this.positionTooltip(item)
        }
        continue
      }
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
    this.hideHoveredItem(true)
    this.currentTime = time
    this.playClock = time
    for (const item of this.active) {
      item.el.remove()
    }
    this.active.length = 0
    this.laneAvailableAt = this.laneAvailableAt.map(() => 0)
    this.pointer = this.lowerBound(time)
    this.restoreVisibleDanmakus(time)
  }

  private restoreVisibleDanmakus(time: number) {
    const visibleStartTime =
      this.track === 'scroll'
        ? Math.max(time - SCROLL_BASE_DURATION * 1.4, 0)
        : Math.max(time - FIXED_DURATION, 0)

    const candidates: NativeDanmakuItem[] = []
    const startIndex = this.lowerBound(visibleStartTime)
    for (let index = startIndex; index < this.timeline.length; index += 1) {
      const item = this.timeline[index]
      if (!item) continue
      if (item.stime > time) break
      candidates.push(item)
    }

    if (this.track === 'scroll') {
      candidates.sort((a, b) => b.stime - a.stime || a.id.localeCompare(b.id))
    }

    const activeLimit = this.getActiveLimit()
    for (const item of candidates) {
      if (this.active.length >= activeLimit) break
      this.restoreOne(item, time)
    }
  }

  private restoreOne(item: NativeDanmakuItem, time: number) {
    const text = item.text?.trim()
    if (!text) return

    const scale = this.options.global.scale || 1
    const fontSize = (item.size || 24) * scale
    const laneHeight = this.getLaneHeight()
    const width = this.stage.clientWidth
    const height = this.stage.clientHeight
    if (!width || !height) return

    const el = document.createElement('div')
    el.dataset.danmakuId = item.id
    el.textContent = text
    el.style.position = 'absolute'
    el.style.whiteSpace = 'nowrap'
    el.style.fontSize = `${fontSize}px`
    el.style.lineHeight = `${laneHeight}px`
    el.style.fontWeight = '700'
    el.style.textShadow = '0 0 2px rgba(0,0,0,0.9), 0 1px 2px rgba(0,0,0,0.75)'
    el.style.color = this.toHexColor(item.color)
    el.style.opacity = `${clamp(this.options.global.opacity, 0.2, 1)}`
    el.style.willChange = 'transform'
    el.style.pointerEvents = this.isHoverEnabled() ? 'auto' : 'none'
    el.style.cursor = this.isHoverEnabled() ? 'pointer' : 'default'
    this.stage.appendChild(el)
    this.bindHoverEvents(el, item.id)

    const measuredWidth = Math.max(el.offsetWidth, 1)
    const { top: trackTop, usableHeight } = this.getTrackMetrics(height, laneHeight)
    const speedRatio = clamp(this.options.global.speed, 0.5, 2)

    if (this.track === 'scroll') {
      const elapsed = Math.max(time - item.stime, 0)
      const speed = this.getScrollSpeed(width, speedRatio, measuredWidth)
      const duration = (width + measuredWidth) / speed
      if (elapsed >= duration) {
        el.remove()
        return
      }
      const x = width - speed * elapsed
      if (x + measuredWidth <= 0) {
        el.remove()
        return
      }
      const lane = this.pickRestoreLane(x, measuredWidth)
      const y = Math.min(
        trackTop + lane * laneHeight,
        Math.max(trackTop + usableHeight - laneHeight, 0)
      )
      this.active.push({
        id: item.id,
        text,
        el,
        lane,
        x,
        y,
        width: measuredWidth,
        speed,
        duration,
        elapsed,
        paused: false,
      })
      this.laneAvailableAt[lane] = Math.max(this.laneAvailableAt[lane] ?? 0, this.playClock + 0.2)
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`
      return
    }

    const elapsed = Math.max(time - item.stime, 0)
    const duration = FIXED_DURATION / speedRatio
    if (elapsed >= duration) {
      el.remove()
      return
    }
    const x = (width - measuredWidth) / 2
    const lane = this.pickRestoreLane(x, measuredWidth)
    const y =
      this.track === 'bottom'
        ? Math.max(trackTop + usableHeight - (lane + 1) * laneHeight, 0)
        : Math.min(trackTop + lane * laneHeight, Math.max(trackTop + usableHeight - laneHeight, 0))
    this.active.push({
      id: item.id,
      text,
      el,
      lane,
      x,
      y,
      width: measuredWidth,
      speed: 0,
      duration,
      elapsed,
      paused: false,
    })
    this.laneAvailableAt[lane] = Math.max(
      this.laneAvailableAt[lane] ?? 0,
      this.playClock + (duration - elapsed) * 0.2
    )
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`
  }

  private pickRestoreLane(x: number, width: number) {
    if (this.laneAvailableAt.length === 0) {
      this.refreshLanes()
    }
    let lane = 0
    let bestScore = Number.POSITIVE_INFINITY
    for (let index = 0; index < this.laneAvailableAt.length; index += 1) {
      const score = this.getRestoreLaneScore(index, x, width)
      if (score < bestScore) {
        bestScore = score
        lane = index
      }
    }
    return lane
  }

  private getRestoreLaneScore(lane: number, x: number, width: number) {
    const laneItems = this.active.filter((item) => item.lane === lane)
    if (laneItems.length === 0) return 0

    const minGap = this.getMinGap(width)
    let score = 0
    for (const item of laneItems) {
      const overlapLeft = Math.max(x, item.x)
      const overlapRight = Math.min(x + width, item.x + item.width)
      const overlapWidth = Math.max(overlapRight - overlapLeft, 0)

      if (overlapWidth > 0) {
        score += 1000 + overlapWidth
        continue
      }

      const gapLeft = Math.abs(x - (item.x + item.width))
      const gapRight = Math.abs(item.x - (x + width))
      const horizontalGap = Math.min(gapLeft, gapRight)
      if (horizontalGap < minGap) {
        score += minGap - horizontalGap
      }
    }

    return score + laneItems.length * 10
  }

  private refreshLanes() {
    const stageHeight = this.stage.clientHeight
    const laneHeight = this.getLaneHeight()
    const { usableHeight } = this.getTrackMetrics(stageHeight, laneHeight)
    const laneCount = Math.max(Math.floor(usableHeight / laneHeight), 1)
    this.laneAvailableAt = new Array(laneCount).fill(0)
  }

  private getTrackMetrics(stageHeight: number, laneHeight: number) {
    const areaRatio = clamp(this.options.global.areaRatio, 0.2, 1)
    const scrollHeight = Math.max(stageHeight * areaRatio, laneHeight)

    if (this.track === 'scroll') {
      return {
        top: 0,
        usableHeight: scrollHeight,
      }
    }

    const fixedRegionHeight = Math.max(
      Math.min(stageHeight * Math.min(areaRatio * 0.36, 0.3), stageHeight * 0.3),
      laneHeight
    )

    return {
      top: this.track === 'top' ? 0 : Math.max(stageHeight - fixedRegionHeight, 0),
      usableHeight: fixedRegionHeight,
    }
  }

  private getActiveLimit() {
    const densityRatio = clamp(this.options.global.density, 0.5, 2)
    return Math.max(Math.ceil(this.laneAvailableAt.length * densityRatio), 1)
  }

  private pickLane(nextWidth: number, nextSpeed: number) {
    if (this.laneAvailableAt.length === 0) {
      this.refreshLanes()
    }
    let bestLane = -1
    let bestScore = Number.POSITIVE_INFINITY

    for (let i = 0; i < this.laneAvailableAt.length; i += 1) {
      const availableAt = this.laneAvailableAt[i] ?? 0
      if (!this.canUseLane(i, nextWidth, nextSpeed)) continue

      const laneScore = this.getLaneScore(i, availableAt)
      if (laneScore < bestScore) {
        bestScore = laneScore
        bestLane = i
      }
    }

    return bestLane
  }

  private getLaneScore(lane: number, availableAt: number) {
    const timePenalty = Math.max(availableAt - this.playClock, 0)
    return lane + timePenalty * 0.0001
  }

  private canUseLane(lane: number, nextWidth: number, nextSpeed: number) {
    const laneItems = this.active.filter((item) => item.lane === lane)
    if (laneItems.length === 0) return true

    if (this.track !== 'scroll') {
      return laneItems.every((item) => item.elapsed >= item.duration * 0.92)
    }

    const minGap = this.getMinGap(nextWidth)
    const rightMost = laneItems.reduce((candidate, item) =>
      item.x > candidate.x ? item : candidate
    )
    const initialGap = this.stage.clientWidth - (rightMost.x + rightMost.width)
    if (initialGap < minGap) return false
    if (nextSpeed <= rightMost.speed || rightMost.speed <= 0) return true

    const timeUntilRightMostExit = (rightMost.x + rightMost.width) / rightMost.speed
    const gapAtExit = initialGap - (nextSpeed - rightMost.speed) * timeUntilRightMostExit
    return gapAtExit >= minGap
  }

  private getMinGap(nextWidth: number) {
    if (this.track === 'scroll') {
      return MIN_SAFE_GAP
    }
    return Math.max(Math.min(nextWidth * 0.08, 22), 10)
  }

  private getLaneHeight() {
    const scale = this.options.global.scale || 1
    return BASE_LANE_HEIGHT * scale
  }

  private getScrollSpeed(stageWidth: number, speedRatio: number, danmakuWidth: number) {
    const visibleDuration = Math.max(SCROLL_BASE_DURATION / speedRatio, 3.6)
    const baseSpeed = stageWidth / visibleDuration
    const widthRatio = clamp(danmakuWidth / Math.max(stageWidth, 1), 0, 1.5)
    return baseSpeed * (1 + widthRatio * 0.8)
  }

  private isHoverEnabled() {
    return this.options.global.hoverable
  }

  private isActive(itemId: string) {
    return this.active.some((item) => item.id === itemId)
  }

  private bindHoverEvents(el: HTMLDivElement, itemId: string) {
    el.addEventListener('mouseenter', () => this.hoverItem(itemId))
    el.addEventListener('mouseleave', () => this.scheduleHideHoveredItem())
  }

  private hoverItem(itemId: string) {
    if (!this.isHoverEnabled()) return
    const item = this.active.find((entry) => entry.id === itemId)
    if (!item) return

    this.clearHideTooltipTimer()
    if (this.hoveredItemId && this.hoveredItemId !== itemId) {
      this.hideHoveredItem(true)
    }

    this.hoveredItemId = itemId
    item.paused = true
    item.el.style.zIndex = '40'
    item.el.style.filter = 'brightness(1.12)'
    this.showTooltip(item)
  }

  private scheduleHideHoveredItem() {
    if (!this.isHoverEnabled()) return
    this.clearHideTooltipTimer()
    this.hideTooltipTimer = window.setTimeout(() => this.hideHoveredItem(), 120)
  }

  private hideHoveredItem(force: boolean = false) {
    this.clearHideTooltipTimer()
    if (!force && this.tooltipEl?.matches(':hover')) return

    if (this.hoveredItemId) {
      const item = this.active.find((entry) => entry.id === this.hoveredItemId)
      if (item) {
        item.paused = false
        item.el.style.zIndex = ''
        item.el.style.filter = ''
      }
    }

    this.hoveredItemId = null
    if (this.tooltipEl) {
      this.tooltipEl.style.visibility = 'hidden'
    }
  }

  private clearHideTooltipTimer() {
    if (this.hideTooltipTimer !== null) {
      window.clearTimeout(this.hideTooltipTimer)
      this.hideTooltipTimer = null
    }
  }

  private destroyTooltip() {
    this.clearHideTooltipTimer()
    this.tooltipEl?.removeEventListener('mouseenter', this.handleTooltipMouseEnter)
    this.tooltipEl?.removeEventListener('mouseleave', this.handleTooltipMouseLeave)
    this.tooltipCopyTriggerEl?.removeEventListener('click', this.handleTooltipClick)
    if (this.tooltipEl) {
      this.tooltipEl.style.visibility = 'hidden'
    }
    this.tooltipCopyTriggerEl = null
    this.tooltipEl = null
  }

  private showTooltip(item: ActiveDanmaku) {
    if (!this.tooltipEl) return
    this.tooltipEl.style.visibility = 'visible'
    this.positionTooltip(item)
  }

  private positionTooltip(item: ActiveDanmaku) {
    if (!this.tooltipEl) return

    const tooltipRect = this.tooltipEl.getBoundingClientRect()
    const stageWidth = this.stage.clientWidth
    const stageHeight = this.stage.clientHeight

    let left = item.x + item.width / 2 - tooltipRect.width / 2
    left = clamp(left, 8, Math.max(stageWidth - tooltipRect.width - 8, 8))

    let top = item.y - tooltipRect.height - 10
    let direction: 'top' | 'bottom' = 'top'
    if (top < 8) {
      direction = 'bottom'
      top = Math.min(
        item.y + this.getLaneHeight() + 10,
        Math.max(stageHeight - tooltipRect.height - 8, 8)
      )
    }

    this.updateTooltipDirection(direction)
    this.tooltipEl.style.left = `${left}px`
    this.tooltipEl.style.top = `${top}px`
  }

  private updateTooltipDirection(direction: 'top' | 'bottom') {
    if (this.tooltipEl) {
      this.tooltipEl.dataset.type = direction
    }
  }

  private async copyHoveredDanmaku() {
    const item = this.hoveredItemId
      ? this.active.find((entry) => entry.id === this.hoveredItemId)
      : null
    if (!item) return

    try {
      await navigator.clipboard.writeText(item.text)
      toast('已复制')
    } catch {
      return
    }
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
