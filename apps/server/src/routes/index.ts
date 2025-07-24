import homeRoute from '@/routes/home.route'
import userRoute from '@/routes/user.route'
import { Router } from 'express'

const router = Router()

router.use(userRoute)
router.use(homeRoute)

export default router
