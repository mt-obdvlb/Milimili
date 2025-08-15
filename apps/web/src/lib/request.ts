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
}

interface FailedRequest {
  resolve: (cookieHeader: string | null) => void
  reject: (error: unknown) => void
}

let isRefreshing = false
let failedQueue: FailedRequest[] = []

const processQueue = (error: unknown, cookieHeader: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error)
    } else {
      resolve(cookieHeader)
    }
  })
  failedQueue = []
}

const request: AxiosInstance = (() => {
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api/v1',
    withCredentials: true,
  })

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
        config.headers.set('Cookie', cookieHeader)
      }
    }
    return config
  })

  instance.interceptors.response.use(
    (res: AxiosResponse) => res.data,
    async (error: AxiosError) => {
      const originalRequest = error.config as RetryableAxiosRequestConfig

      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise<string | null>((resolve, reject) => {
            failedQueue.push({ resolve, reject })
          })
            .then((cookieHeader) => {
              if (isServer() && cookieHeader) {
                originalRequest.headers.Cookie = cookieHeader
              }
              return instance(originalRequest)
            })
            .catch((err) => Promise.reject(err))
        }

        originalRequest._retry = true
        isRefreshing = true

        try {
          const refreshConfig: AxiosRequestConfig = {}
          if (isServer()) {
            const { cookies } = await import('next/headers')

            const cookieStore = await cookies()
            const refreshToken = cookieStore.get('refresh_token')
            if (refreshToken) {
              refreshConfig.headers = {
                Cookie: `refresh_token=${refreshToken.value}`,
              }
            }
          }

          await instance.post('/auth/refresh', {}, refreshConfig)

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

          processQueue(null, newCookieHeader)

          if (isServer() && newCookieHeader) {
            originalRequest.headers.Cookie = newCookieHeader
          }

          return instance(originalRequest)
        } catch (err) {
          processQueue(err, null)
          return Promise.reject(err)
        } finally {
          isRefreshing = false
        }
      }

      return Promise.reject(error)
    }
  )

  return instance
})()

export default request
