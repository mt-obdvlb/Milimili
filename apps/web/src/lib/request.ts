import axios, {
  type AxiosError,
  AxiosHeaders,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import { isServer } from '@/utils'
import { AuthRefresh, Result } from '@mtobdvlb/shared-types'
import { toast } from '@/lib/toast'

interface RetryableAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
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
    baseURL: 'http://localhost:3000/api/v1',
    withCredentials: true,
    timeout: 15000,
  })

  // —— request interceptor
  instance.interceptors.request.use(async (config: RetryableAxiosRequestConfig) => {
    const headers = new AxiosHeaders(config.headers)

    // ⚠️ 如果 headers 已经有 Cookie（说明是 refresh 或者重试时手动设置的），不要覆盖
    if (headers.get('Cookie')) {
      config.headers = headers
      return config
    }

    if (isServer()) {
      // SSR 下才手动注入 Cookie
      const { cookies } = await import('next/headers')
      const cookieStore = await cookies()
      const accessToken = cookieStore.get('access_token')?.value
      const refreshToken = cookieStore.get('refresh_token')?.value

      const cookieHeader = [
        accessToken ? `access_token=${accessToken}` : '',
        refreshToken ? `refresh_token=${refreshToken}` : '',
      ]
        .filter(Boolean)
        .join('; ')

      if (cookieHeader) {
        headers.set('Cookie', cookieHeader)
      }
    }

    config.headers = headers
    return config
  })

  // —— response interceptor
  instance.interceptors.response.use(
    (res: AxiosResponse) => {
      console.log(res.data)
      return res.data
    },
    async (error: AxiosError) => {
      const originalRequest = error.config as RetryableAxiosRequestConfig

      if (originalRequest?.skipAuthRefresh) {
        return error.response?.data
      }

      if (error.response?.status === 401) {
        // 已重试过一次，不再触发刷新
        if (originalRequest._retry) {
          return error.response?.data
        }

        // 正在刷新 → 先排队，等拿到新的 Cookie 再继续
        if (isRefreshing) {
          return new Promise<string | null>((resolve, reject) => {
            failedQueue.push({ resolve, reject })
          }).then((cookieHeader) => {
            originalRequest._retry = true
            // 浏览器端不再手动设置 Cookie
            if (isServer() && cookieHeader) {
              const hdrs = new AxiosHeaders(originalRequest.headers)
              hdrs.set('Cookie', cookieHeader)
              originalRequest.headers = hdrs
            }
            return instance(originalRequest)
          })
        }

        // 首次触发刷新
        originalRequest._retry = true
        isRefreshing = true

        try {
          const refreshConfig: AxiosRequestConfig & {
            skipAuthRefresh?: boolean
          } = {
            skipAuthRefresh: true,
          }

          // SSR 情况下只传 refresh_token
          if (isServer()) {
            const { cookies } = await import('next/headers')
            const cookieStore = await cookies()
            const refreshToken = cookieStore.get('refresh_token')?.value
            if (refreshToken) {
              refreshConfig.headers = new AxiosHeaders({
                Cookie: `refresh_token=${refreshToken}`,
              })
            }
          }

          // 调用刷新接口
          const refreshData = await instance
            .post<Result<AuthRefresh>>('/auth/refresh', {}, refreshConfig)
            .then((r) => r.data)

          const newCookieHeader = [
            refreshData?.accessToken ? `access_token=${refreshData.accessToken}` : '',
            refreshData?.refreshToken ? `refresh_token=${refreshData.refreshToken}` : '',
          ]
            .filter(Boolean)
            .join('; ')

          // 唤醒队列，给所有排队的请求注入最新 Cookie
          processQueue(null, newCookieHeader)

          // SSR 下才设置 Cookie 到重试请求头
          if (isServer() && newCookieHeader) {
            const hdrs = new AxiosHeaders(originalRequest.headers)
            hdrs.set('Cookie', newCookieHeader)
            originalRequest.headers = hdrs
          }

          return instance(originalRequest)
        } catch (err) {
          processQueue(err, null)

          if (!isServer()) {
            toast((error.response.data as { message: string })?.message)
          }
          return error.response.data
        } finally {
          isRefreshing = false
        }
      }

      // 其他错误
      if (error.response) {
        if (!isServer()) {
          toast((error.response.data as { message: string })?.message)
        }
        return error.response.data
      }
      return {
        code: 1,
        message: error.message,
      }
    }
  )

  return instance
})()

export default request
