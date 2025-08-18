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
