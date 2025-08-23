import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import { isServer } from '@/utils'

interface RetryableAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
  // 标记该请求不要触发刷新流程（专用于 /auth/refresh）
  skipAuthRefresh?: boolean
}

interface FailedRequest {
  resolve: (cookieHeader: string | null) => void
  reject: (error: unknown) => void
}

let isRefreshing = false
let failedQueue: FailedRequest[] = []

const processQueue = (error: unknown, cookieHeader: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error)
    else resolve(cookieHeader)
  })
  failedQueue = []
}

const request: AxiosInstance = (() => {
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api/v1',
    withCredentials: true,
    // 建议加个超时，防止网络级挂起（可按需调整/删除）
    timeout: 15000,
  })

  // —— request interceptor
  instance.interceptors.request.use(async (config: RetryableAxiosRequestConfig) => {
    if (isServer()) {
      const { cookies } = await import('next/headers')
      const cookieStore = await cookies()
      const accessToken = cookieStore.get('access_token')
      const refreshToken = cookieStore.get('refresh_token')

      const cookieHeader = [
        accessToken ? `access_token=${accessToken.value}` : '',
        refreshToken ? `refresh_token=${refreshToken.value}` : '',
      ]
        .filter(Boolean)
        .join('; ')

      if (cookieHeader) {
        // axios v1 的 headers 支持 set
        config.headers.set?.('Cookie', cookieHeader)
      }
    }
    return config
  })

  // —— response interceptor
  instance.interceptors.response.use(
    // 成功：直接返回后端数据
    (res: AxiosResponse) => res.data,
    // 失败：尽量返回后端数据；仅无响应时才抛错
    async (error: AxiosError) => {
      const originalRequest = error.config as RetryableAxiosRequestConfig

      // 若是刷新请求本身或显式跳过，直接把后端返回给出去（不参与刷新逻辑）
      if (originalRequest?.skipAuthRefresh) {
        return error.response?.data
      }

      // —— 仅处理 401
      if (error.response?.status === 401) {
        // 已重试过一次：不再触发刷新，直接把后端返回给出去，避免循环
        if (originalRequest._retry) {
          return error.response.data
        }

        // 如果正在刷新，排队等待刷新结果
        if (isRefreshing) {
          return new Promise<string | null>((resolve, reject) => {
            failedQueue.push({ resolve, reject })
          })
            .then((cookieHeader) => {
              // 标记：这次重发视为已重试，若再 401 则不会再次刷新
              originalRequest._retry = true
              if (isServer() && cookieHeader) {
                originalRequest.headers = originalRequest.headers || {}
                ;(originalRequest.headers as any).Cookie = cookieHeader
              }
              return instance(originalRequest)
            })
            .catch((e) => {
              // 刷新失败时，把后端错误返回（若没有响应，只能抛错）
              const err = e as AxiosError
              if (err.response) return err.response.data
              return Promise.reject(err)
            })
        }

        // —— 首次触发刷新
        originalRequest._retry = true
        isRefreshing = true

        try {
          const refreshConfig: AxiosRequestConfig & {
            skipAuthRefresh?: boolean
          } = {
            // 跳过刷新逻辑，防止对 /auth/refresh 自己再次进入 401 分支
            skipAuthRefresh: true,
          }

          if (isServer()) {
            const { cookies } = await import('next/headers')
            const cookieStore = await cookies()
            const refreshToken = cookieStore.get('refresh_token')
            if (refreshToken) {
              refreshConfig.headers = {
                ...(refreshConfig.headers || {}),
                Cookie: `refresh_token=${refreshToken.value}`,
              }
            }
          }

          // 用同一个 instance 调用刷新接口，但打了 skipAuthRefresh 标记
          await instance.post('/auth/refresh', {}, refreshConfig as AxiosRequestConfig)

          // 读取刷新后的 cookie，拼装给排队请求
          let newCookieHeader: string | null = null
          if (isServer()) {
            const { cookies } = await import('next/headers')
            const cookieStore = await cookies()
            const newAccessToken = cookieStore.get('access_token')
            const refreshToken = cookieStore.get('refresh_token')
            newCookieHeader = [
              newAccessToken ? `access_token=${newAccessToken.value}` : '',
              refreshToken ? `refresh_token=${refreshToken.value}` : '',
            ]
              .filter(Boolean)
              .join('; ')
          }

          // 唤醒队列
          processQueue(null, newCookieHeader)

          // 立即重发当前请求
          if (isServer() && newCookieHeader) {
            originalRequest.headers = originalRequest.headers || {}
            ;(originalRequest.headers as any).Cookie = newCookieHeader
          }
          return instance(originalRequest)
        } catch (err) {
          // 刷新失败：唤醒队列（失败）
          processQueue(err, null)

          // 刷新失败时，把“刷新请求”的后端响应返回；若没有，则返回“原始 401”的后端响应
          const refreshAxiosErr = err as AxiosError
          if (refreshAxiosErr.response) return refreshAxiosErr.response.data
          if (error.response) return error.response.data

          // 两者都没有后端响应（纯网络错误）
          return Promise.reject(err)
        } finally {
          isRefreshing = false
        }
      }

      // —— 非 401：如果有后端响应，原样返回；否则（网络错误）只能抛错
      if (error.response) return error.response.data
      return Promise.reject(error)
    }
  )

  return instance
})()

export default request
