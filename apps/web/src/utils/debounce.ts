type DebounceOptions = {
  /** 是否在开始时立即执行一次 */
  leading?: boolean
  /** 是否在延迟结束后执行一次 */
  trailing?: boolean
}

export const debounce = <Args extends unknown[], R>(
  fn: (...args: Args) => R,
  wait = 300,
  options: DebounceOptions = {
    leading: false,
    trailing: true,
  }
): ((...args: Args) => R | void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null
  let lastArgs: Args | null = null
  let lastResult: R | void
  let invoked = false

  const invoke = (): R => {
    invoked = true
    const result = fn(...(lastArgs as Args))
    lastArgs = null
    return result
  }

  const later = () => {
    timeout = null
    if (options.trailing && lastArgs) {
      lastResult = invoke()
    }
  }

  return (...args: Args): R | void => {
    lastArgs = args

    const shouldCallNow = options.leading && !timeout && !invoked

    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)

    if (shouldCallNow) {
      lastResult = invoke()
    }

    return lastResult
  }
}

/**
 * React 环境下可直接当 hook 用
 * 用法： const handleChange = useCallback(useDebounce(fn, 300), [])
 */
export const useDebounce = debounce
