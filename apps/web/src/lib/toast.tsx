import { toast as sonnerToast } from 'sonner'
import 'client-only'
import { throttle } from '@/utils/throttle'

export const toast = (message: string | number) => {
  if (!message) return
  return throttle((message: string | number) => sonnerToast.message(message), 1000)
}

export const toastBuilding = throttle(() => sonnerToast.message('正在建设中...'), 1000)
