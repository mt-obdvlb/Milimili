export const formatTime = (time: number): string => {
  const hours = Math.floor(time / 3600)
  const minutes = Math.floor((time % 3600) / 60)
  const seconds = time % 60

  const h = hours > 0 ? `${String(hours).padStart(2, '0')}:` : ''
  const m = String(minutes).padStart(2, '0')
  const s = String(seconds).padStart(2, '0')

  return `${h}${m}:${s}`
}

export const formatPlayCount = (count: number): string =>
  count < 10000 ? count.toString() : `${Math.floor(count / 10000)}万`

export const formatWatchAt = (watchAt: string): string => {
  const date = new Date(watchAt)
  if (isNaN(date.getTime())) return watchAt // 无效时间直接返回

  const now = new Date()

  // 把小时分钟格式化
  const pad = (n: number) => n.toString().padStart(2, '0')
  const timeStr = `${pad(date.getHours())}:${pad(date.getMinutes())}`

  // 今天0点
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  // 昨天0点
  const yesterdayStart = new Date(todayStart)
  yesterdayStart.setDate(todayStart.getDate() - 1)

  if (date >= todayStart) {
    return `今天 ${timeStr}`
  } else if (date >= yesterdayStart) {
    return `昨天 ${timeStr}`
  } else {
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${timeStr}`
  }
}
export const formatFeedDate = (dateStr: string): string => {
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return 'Invalid date'

  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMinutes < 60) {
    return `${diffMinutes}分钟前`
  } else if (diffHours < 24) {
    return `${diffHours}小时前`
  } else if (diffDays <= 7) {
    return `${diffDays}天前`
  } else {
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    return `${month}-${day}`
  }
}

export const formatMessageDate = (dateStr: string): string => {
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return 'Invalid date'

  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMinutes < 60) {
    return `${diffMinutes}分钟前`
  } else if (diffHours < 24) {
    return `${diffHours}小时前`
  } else if (diffDays <= 7) {
    return `${diffDays}天前`
  } else {
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    return `${month}-${day}`
  }
}
