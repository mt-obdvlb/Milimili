import { FollowModel } from '@/models'
import { getSocketIdByUserId } from '@/socket/index'
import { io } from '@/server'

export const pushNewFeed = async (followingId: string) => {
  const followers = await FollowModel.find({ followingId })
  followers.forEach((followerId) => {
    const socketId = getSocketIdByUserId(followerId.followrId.toString())
    if (socketId) {
      io.to(socketId).emit('new_feed')
    }
  })
}
