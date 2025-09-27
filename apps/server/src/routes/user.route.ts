import { Router } from 'express'
import {
  userAtList,
  userFindPassword,
  userGetByEmail,
  userGetByName,
  userGetInfo,
  userGetInfoHome,
  userLogin,
  userLogout,
} from '@/controllers/user.controller'
import { authMiddleware, validatorMiddleware } from '@/middlewares'
import { asyncHandler } from '@/utils'
import {
  userAtDTO,
  userFindPasswordDTO,
  userGetByEmailDTO,
  userGetByNameDTO,
  userLoginDTO,
} from '@mtobdvlb/shared-types'

const router = Router()

router.post('/login', validatorMiddleware({ body: userLoginDTO }), asyncHandler(userLogin))
router.post('/logout', authMiddleware, asyncHandler(userLogout))
router.get('/info/home', authMiddleware, asyncHandler(userGetInfoHome))
router.get('/info', authMiddleware, asyncHandler(userGetInfo))
router.get(
  '/email',
  validatorMiddleware({ query: userGetByEmailDTO }),
  asyncHandler(userGetByEmail)
)
router.put(
  '/find-password',
  validatorMiddleware({ body: userFindPasswordDTO }),
  asyncHandler(userFindPassword)
)
router.get('/name', validatorMiddleware({ query: userGetByNameDTO }), asyncHandler(userGetByName))
router.get(
  '/at',
  authMiddleware,
  validatorMiddleware({ query: userAtDTO }),
  asyncHandler(userAtList)
)

export default router
