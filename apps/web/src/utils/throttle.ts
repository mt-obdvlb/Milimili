type ThrottleOptions = {
  leading?: boolean
  trailing?: boolean
}

export const throttle = <Args extends unknown[], R>(
  fn: (...args: Args) => R,
  wait = 2000,
  options: ThrottleOptions = {
    leading: true,
    trailing: false,
  }
): ((...args: Args) => R | void) => {
  let lastTime = 0
  let timeout: ReturnType<typeof setTimeout> | null = null

  return (...args: Args): R | void => {
    const now = Date.now()

    const invoke = (): R => {
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
