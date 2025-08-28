import { FollowModel } from '@/models'
import { emitToUser } from '@/socket/index'
import { io } from '@/server'

export const pushNewFeed = async (followingId: string) => {
  const followers = await FollowModel.find({ followingId })
  followers.forEach((followrId) => {
    emitToUser(io, followrId.followerId.toString(), 'new_feed')
  })
}
