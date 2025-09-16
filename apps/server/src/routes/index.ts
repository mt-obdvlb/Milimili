import userRoute from '@/routes/user.route'
import { Router } from 'express'
import authRoute from '@/routes/auth.route'
import categoryRoute from '@/routes/category.route'
import videoRoute from '@/routes/video.route'
import feedRoute from '@/routes/feed.route'
import historyRoute from '@/routes/history.route'
import commentRoute from '@/routes/comment.route'
import favoriteRoute from '@/routes/favorite.route'
import searchLogRoute from '@/routes/search-log.route'
import searchRoute from '@/routes/search.route'
import followRoute from '@/routes/follow.route'
import commonRoute from '@/routes/common.route'
import messageRoute from '@/routes/message.route'

const router = Router()

router.use('/auth', authRoute)
router.use('/users', userRoute)
router.use('/categories', categoryRoute)
router.use('/videos', videoRoute)
router.use('/feeds', feedRoute)
router.use('/histories', historyRoute)
router.use('/comments', commentRoute)
router.use('/favorites', favoriteRoute)
router.use('/messages', messageRoute)
router.use('/search-logs', searchLogRoute)
router.use('/searches', searchRoute)
router.use('/follows', followRoute)
router.use('/commons', commonRoute)

export default router
