import { toast as sonnerToast } from 'sonner'
import { throttle } from '@/utils/throttle'

export const toast = throttle((message: string | number) => {
  if (!message) return
  return sonnerToast.message(message)
}, 1000)

export const toastBuilding = throttle(() => sonnerToast.message('正在建设中...'), 1000)
