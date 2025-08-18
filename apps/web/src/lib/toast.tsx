import { toast as sonnerToast } from 'sonner'
import 'client-only'
import { throttle } from '@/utils/throttle'

export const toast = (message: string) => sonnerToast.message(message)

export const toastBuilding = throttle(() => sonnerToast.message('正在建设中...'), 1000)
