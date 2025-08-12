import { Router } from 'express'
import { authRefresh } from '@/controllers/auth.controller'

const router = Router()

router.post('/refresh', authRefresh)

export default router
