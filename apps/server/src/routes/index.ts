import userRoute from '@/routes/user.route'
import { Router } from 'express'

const router = Router()

router.use(userRoute)

export default router
