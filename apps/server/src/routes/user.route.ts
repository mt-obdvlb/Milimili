import { Router } from 'express'
import { userGetInfo, userGetInfoHome, userLogin, userLogout } from '@/controllers/user.controller'
import { authMiddleware, validatorMiddleware } from '@/middlewares'
import { userLoginDTO } from '@/dtos/user/login.dto'
import { asyncHandler } from '@/utils'

const router = Router()

router.post('/login', validatorMiddleware({ body: userLoginDTO }), asyncHandler(userLogin))
router.post('/logout', authMiddleware, asyncHandler(userLogout))
router.get('/info/home', authMiddleware, asyncHandler(userGetInfoHome))
router.get('/info', authMiddleware, asyncHandler(userGetInfo))

export default router
