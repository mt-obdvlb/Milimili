import { beforeAll, describe, expect, it, vi } from 'vitest'
import request from 'supertest'
import { createRouteApp } from '@/__test__/utils/route-contract.utils'

let app: ReturnType<typeof createRouteApp>

describe('tagRoute', () => {
  beforeAll(async () => {
    vi.resetModules()

    // @ts-expect-error Vitest resolves TS path aliases at test runtime.
    const { default: tagRoute } = await import('@/routes/tag.route')
    app = createRouteApp(tagRoute)
  })

  it('returns 404 because the router is currently empty', async () => {
    const response = await request(app).get('/')

    expect(response.status).toBe(404)
  })
})
