import homeRoute from '@/routes/home.route'
import userRoute from '@/routes/user.route'
import { Router } from 'express'
import authRoute from '@/routes/auth.route'

const router = Router()

router.use('/auth', authRoute)
router.use('/user', userRoute)
router.use('/', homeRoute)

export default router
