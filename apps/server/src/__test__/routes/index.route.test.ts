import express from 'express'
import request from 'supertest'
import { beforeAll, describe, expect, it, vi } from 'vitest'

const createMarkerRouter = async (scope: string) => {
  const { Router } = await import('express')
  const router = Router()
  router.get('/__marker', (_req, res) => {
    res.status(200).json({ scope })
  })
  return router
}

describe('api route index', () => {
  let app: express.Express

  beforeAll(async () => {
    vi.resetModules()
    vi.doMock('@/routes/auth.route', async () => ({ default: await createMarkerRouter('auth') }))
    vi.doMock('@/routes/user.route', async () => ({ default: await createMarkerRouter('users') }))
    vi.doMock('@/routes/category.route', async () => ({
      default: await createMarkerRouter('categories'),
    }))
    vi.doMock('@/routes/video.route', async () => ({ default: await createMarkerRouter('videos') }))
    vi.doMock('@/routes/feed.route', async () => ({ default: await createMarkerRouter('feeds') }))
    vi.doMock('@/routes/history.route', async () => ({
      default: await createMarkerRouter('histories'),
    }))
    vi.doMock('@/routes/comment.route', async () => ({
      default: await createMarkerRouter('comments'),
    }))
    vi.doMock('@/routes/favorite.route', async () => ({
      default: await createMarkerRouter('favorites'),
    }))
    vi.doMock('@/routes/message.route', async () => ({
      default: await createMarkerRouter('messages'),
    }))
    vi.doMock('@/routes/search-log.route', async () => ({
      default: await createMarkerRouter('search-logs'),
    }))
    vi.doMock('@/routes/search.route', async () => ({
      default: await createMarkerRouter('searches'),
    }))
    vi.doMock('@/routes/follow.route', async () => ({
      default: await createMarkerRouter('follows'),
    }))
    vi.doMock('@/routes/common.route', async () => ({
      default: await createMarkerRouter('commons'),
    }))
    vi.doMock('@/routes/like.route', async () => ({ default: await createMarkerRouter('likes') }))
    vi.doMock('@/routes/health.route', async () => ({
      default: await createMarkerRouter('health'),
    }))

    // @ts-expect-error Vitest resolves TS path aliases at test runtime.
    const { default: routes } = await import('@/routes')
    app = express()
    app.use(routes)
  })

  it.each([
    ['/auth/__marker', 'auth'],
    ['/users/__marker', 'users'],
    ['/categories/__marker', 'categories'],
    ['/videos/__marker', 'videos'],
    ['/feeds/__marker', 'feeds'],
    ['/histories/__marker', 'histories'],
    ['/comments/__marker', 'comments'],
    ['/favorites/__marker', 'favorites'],
    ['/messages/__marker', 'messages'],
    ['/search-logs/__marker', 'search-logs'],
    ['/searches/__marker', 'searches'],
    ['/follows/__marker', 'follows'],
    ['/commons/__marker', 'commons'],
    ['/likes/__marker', 'likes'],
    ['/__marker', 'health'],
  ])('mounts %s', async (path, scope) => {
    const response = await request(app).get(path)

    expect(response.status).toBe(200)
    expect(response.body).toEqual({ scope })
  })
})
