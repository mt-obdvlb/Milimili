type ThrottleOptions = {
  leading?: boolean
  trailing?: boolean
}

export const throttle = <T extends (...args: unknown[]) => ReturnType<T>>(
  fn: T,
  wait = 2000,
  options: ThrottleOptions = {
    leading: true,
    trailing: false,
  }
): ((...args: Parameters<T>) => ReturnType<T> | void) => {
  let lastTime = 0
  let timeout: ReturnType<typeof setTimeout> | null = null

  return (...args: Parameters<T>): ReturnType<T> | void => {
    const now = Date.now()

    const invoke = (): ReturnType<T> => {
      lastTime = Date.now()
      return fn(...args)
    }

    if (options.leading && lastTime === 0) {
      return invoke()
    }

    const remaining = wait - (now - lastTime)

    if (remaining <= 0) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      return invoke()
    } else if (options.trailing && !timeout) {
      timeout = setTimeout(() => {
        invoke()
        timeout = null
      }, remaining)
    }
  }
}
