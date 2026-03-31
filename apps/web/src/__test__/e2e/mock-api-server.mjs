import { createServer } from 'node:http'
import { URL } from 'node:url'

const HOST = process.env.MOCK_API_HOST ?? '127.0.0.1'
const PORT = Number(process.env.MOCK_API_PORT ?? 3010)
const FRONTEND_ORIGIN = process.env.MOCK_FRONTEND_ORIGIN ?? 'http://127.0.0.1:3001'
const API_PREFIX = '/api/v1'

const defaultAccessToken = 'mock-access-token'
const defaultRefreshToken = 'mock-refresh-token'

const createVideo = (index) => ({
  id: `video-${index}`,
  title: `Mock 首页视频 ${index}`,
  thumbnail: '/images/header-banner.png',
  url: `http://${HOST}:${PORT}${API_PREFIX}/mock-assets/video.mp4`,
  time: 600 + index,
  views: 1000 * index,
  danmakus: 20 * index,
  userId: 'user-100',
  username: 'Mock 创作者',
  publishedAt: new Date(2026, 2, index).toISOString(),
})

const videos = Array.from({ length: 24 }, (_, index) => createVideo(index + 1))

const detailVideo = {
  video: {
    id: 'video-1',
    title: 'Mock 视频详情标题',
    thumbnail: '/images/header-banner.png',
    url: `http://${HOST}:${PORT}${API_PREFIX}/mock-assets/video.mp4`,
    description: '这是用于端到端测试的 mock 视频详情。',
    publishAt: new Date(2026, 2, 28, 9, 30).toISOString(),
    views: 24680,
    danmakus: 128,
    likes: 321,
    favorites: 88,
    shares: 16,
    comments: 0,
    time: 720,
  },
  user: {
    id: 'user-100',
    name: 'Mock 视频作者',
    avatar: '/images/avatar.jpg',
  },
  tags: ['测试', 'Mock'],
}

const currentUser = {
  id: 'user-100',
  name: 'Mock 测试用户',
  avatar: '/images/avatar.jpg',
  email: 'tester@example.com',
}

const userHomeInfo = {
  user: currentUser,
  followers: 123,
  followings: 45,
  feeds: 6,
}

const feedItems = [
  {
    id: 'feed-1',
    title: 'Mock 图文动态',
    content: '这里是使用 mock 数据渲染出来的动态内容。',
    publishedAt: new Date(2026, 2, 29, 12, 0).toISOString(),
    type: 'image-text',
    comments: 0,
    likes: 7,
    images: ['/images/feed-image-left.png', '/images/feed-image-right.png'],
    user: {
      id: 'user-200',
      name: 'Mock 动态作者',
      avatar: '/images/avatar.jpg',
    },
  },
  {
    id: 'feed-2',
    title: 'Mock 第二条动态',
    content: '第二条动态用于验证列表渲染和分页。',
    publishedAt: new Date(2026, 2, 28, 18, 20).toISOString(),
    type: 'image-text',
    comments: 0,
    likes: 3,
    images: [],
    user: {
      id: 'user-201',
      name: 'Mock 第二作者',
      avatar: '/images/avatar.jpg',
    },
  },
]

const historyList = [
  {
    videoId: 'video-1',
    title: 'Mock 历史视频',
    thumbnail: '/images/header-banner.png',
    time: 720,
    duration: 180,
    watchAt: new Date().toISOString(),
    publishedAt: new Date(2026, 2, 28, 9, 30).toISOString(),
    userId: 'user-100',
    username: 'Mock 视频作者',
    isFavorite: true,
  },
  {
    videoId: 'video-2',
    title: 'Mock 昨日历史视频',
    thumbnail: '/images/header-banner.png',
    time: 560,
    duration: 120,
    watchAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    publishedAt: new Date(2026, 2, 27, 20, 0).toISOString(),
    userId: 'user-100',
    username: 'Mock 视频作者',
    isFavorite: false,
  },
]

const favoriteFolders = [
  {
    id: 'favorite-default',
    name: '默认收藏夹',
    number: 3,
    type: 'default',
    thumbnail: '/images/favorite-folder.png',
  },
]

const searchUser = {
  user: {
    id: 'user-300',
    name: 'Mock 猫猫 UP',
    avatar: '/images/avatar.jpg',
    followers: 987,
    videos: 12,
  },
  video: videos.slice(0, 3),
}

const searchResults = videos.slice(0, 6).map((video, index) => ({
  video: {
    ...video,
    title: `Mock 搜索视频 ${index + 1}`,
  },
  user: {
    id: `user-search-${index + 1}`,
    name: `Mock 搜索作者 ${index + 1}`,
    avatar: '/images/avatar.jpg',
    followers: 50 + index,
    videos: 5 + index,
  },
}))

const categories = [
  { id: 'cat-1', name: '番剧' },
  { id: 'cat-2', name: '动画' },
  { id: 'cat-3', name: '国创' },
  { id: 'cat-4', name: '音乐' },
  { id: 'cat-5', name: '游戏' },
]

const searchLogTop10 = [
  '猫猫',
  '旅行视频',
  '前端测试',
  'mock 数据',
  '番剧推荐',
  '游戏实况',
  '音乐现场',
  '端到端测试',
  'React',
  'Next.js',
].map((keyword, index) => ({
  rank: index + 1,
  keyword,
}))

const parseBody = async (req) => {
  const chunks = []

  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }

  if (!chunks.length) {
    return null
  }

  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'))
  } catch {
    return null
  }
}

const parseCookies = (cookieHeader = '') =>
  cookieHeader
    .split(';')
    .map((part) => part.trim())
    .filter(Boolean)
    .reduce((acc, part) => {
      const [key, ...rest] = part.split('=')
      acc[key] = rest.join('=')
      return acc
    }, {})

const withCors = (res) => {
  res.setHeader('Access-Control-Allow-Origin', FRONTEND_ORIGIN)
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Cookie')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS')
}

const sendJson = (res, payload, { status = 200, cookies = [] } = {}) => {
  withCors(res)
  if (cookies.length) {
    res.setHeader('Set-Cookie', cookies)
  }
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
  })
  res.end(JSON.stringify(payload))
}

const sendBinary = (res, { type, body }) => {
  withCors(res)
  res.writeHead(200, {
    'Content-Type': type,
    'Content-Length': body.length,
    'Cache-Control': 'no-store',
  })
  res.end(body)
}

const authCookies = (accessToken = defaultAccessToken, refreshToken = defaultRefreshToken) => [
  `access_token=${accessToken}; Path=/; HttpOnly; SameSite=Lax`,
  `refresh_token=${refreshToken}; Path=/; HttpOnly; SameSite=Lax`,
]

const isAuthenticated = (req) => {
  const cookies = parseCookies(req.headers.cookie)
  return (
    cookies.access_token?.startsWith('mock-access-token') ||
    cookies.refresh_token?.startsWith('mock-refresh-token')
  )
}

const paginate = (list, page = 1, pageSize = 10) => {
  const safePage = Number(page) || 1
  const safePageSize = Number(pageSize) || list.length
  const start = (safePage - 1) * safePageSize
  const end = start + safePageSize

  return {
    list: list.slice(start, end),
    total: list.length,
    page: safePage,
    pageSize: safePageSize,
  }
}

const server = createServer(async (req, res) => {
  withCors(res)

  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    res.end()
    return
  }

  if (!req.url) {
    sendJson(res, { code: 1, message: 'Missing URL' }, { status: 400 })
    return
  }

  const url = new URL(req.url, `http://${HOST}:${PORT}`)
  const pathname = url.pathname

  if (pathname === `${API_PREFIX}/mock-assets/video.mp4`) {
    sendBinary(res, { type: 'video/mp4', body: Buffer.alloc(0) })
    return
  }

  if (pathname === `${API_PREFIX}/categories/` && req.method === 'GET') {
    sendJson(res, { code: 0, message: 'ok', data: categories })
    return
  }

  if (pathname === `${API_PREFIX}/videos/list` && req.method === 'GET') {
    const page = url.searchParams.get('page')
    const pageSize = url.searchParams.get('pageSize')
    sendJson(res, {
      code: 0,
      message: 'ok',
      data: paginate(videos, page, pageSize),
    })
    return
  }

  if (pathname.startsWith(`${API_PREFIX}/videos/detail/`) && req.method === 'GET') {
    sendJson(res, { code: 0, message: 'ok', data: detailVideo })
    return
  }

  if (pathname.startsWith(`${API_PREFIX}/videos/danmakus/`) && req.method === 'GET') {
    sendJson(res, { code: 0, message: 'ok', data: [] })
    return
  }

  if (pathname === `${API_PREFIX}/users/info` && req.method === 'GET') {
    sendJson(res, { code: 0, message: 'ok', data: null })
    return
  }

  if (pathname === `${API_PREFIX}/users/info/home` && req.method === 'GET') {
    if (!isAuthenticated(req)) {
      sendJson(res, { code: 1, message: '未登录', data: null }, { status: 401 })
      return
    }

    sendJson(res, { code: 0, message: 'ok', data: userHomeInfo })
    return
  }

  if (pathname === `${API_PREFIX}/users/login` && req.method === 'POST') {
    const body = await parseBody(req)

    if (!body?.email || (!body?.password && !body?.code)) {
      sendJson(res, { code: 1, message: '参数错误' }, { status: 400 })
      return
    }

    sendJson(
      res,
      { code: 0, message: '登录成功', data: null },
      {
        cookies: authCookies(),
      }
    )
    return
  }

  if (pathname === `${API_PREFIX}/auth/send-code` && req.method === 'POST') {
    const body = await parseBody(req)

    if (!body?.email) {
      sendJson(res, { code: 1, message: '邮箱不能为空' }, { status: 400 })
      return
    }

    sendJson(res, { code: 0, message: '验证码已发送', data: null })
    return
  }

  if (pathname === `${API_PREFIX}/auth/refresh` && req.method === 'POST') {
    const cookies = parseCookies(req.headers.cookie)

    if (!cookies.refresh_token?.startsWith('mock-refresh-token')) {
      sendJson(res, { code: 1, message: 'refresh token 无效', data: null }, { status: 401 })
      return
    }

    const accessToken = 'mock-access-token-refreshed'
    const refreshToken = 'mock-refresh-token-refreshed'

    sendJson(
      res,
      {
        code: 0,
        message: '刷新成功',
        data: {
          accessToken,
          refreshToken,
        },
      },
      {
        cookies: authCookies(accessToken, refreshToken),
      }
    )
    return
  }

  if (pathname === `${API_PREFIX}/search-logs/top10` && req.method === 'GET') {
    sendJson(res, { code: 0, message: 'ok', data: searchLogTop10 })
    return
  }

  if (pathname === `${API_PREFIX}/searches/` && req.method === 'GET') {
    const kw = url.searchParams.get('kw') ?? ''

    sendJson(res, {
      code: 0,
      message: 'ok',
      data: {
        user: kw ? searchUser : null,
        list: {
          list: kw ? searchResults : [],
          total: kw ? searchResults.length : 0,
        },
      },
    })
    return
  }

  if (pathname === `${API_PREFIX}/feeds/following` && req.method === 'GET') {
    sendJson(res, {
      code: 0,
      message: 'ok',
      data: [
        { userId: 'user-200', name: 'Mock 动态作者', avatar: '/images/avatar.jpg' },
        { userId: 'user-201', name: 'Mock 第二作者', avatar: '/images/avatar.jpg' },
      ],
    })
    return
  }

  if (pathname === `${API_PREFIX}/feeds/` && req.method === 'GET') {
    const page = url.searchParams.get('page')
    const pageSize = url.searchParams.get('pageSize')
    sendJson(res, {
      code: 0,
      message: 'ok',
      data: paginate(feedItems, page, pageSize),
    })
    return
  }

  if (pathname === `${API_PREFIX}/histories/list` && req.method === 'GET') {
    const page = url.searchParams.get('page')
    const pageSize = url.searchParams.get('pageSize')
    sendJson(res, {
      code: 0,
      message: 'ok',
      data: paginate(historyList, page, pageSize),
    })
    return
  }

  if (pathname === `${API_PREFIX}/comments` && req.method === 'GET') {
    sendJson(res, {
      code: 0,
      message: 'ok',
      data: {
        list: [],
        total: 0,
      },
    })
    return
  }

  if (pathname === `${API_PREFIX}/likes` && req.method === 'GET') {
    sendJson(res, { code: 1, message: '未点赞', data: null })
    return
  }

  if (pathname === `${API_PREFIX}/likes` && (req.method === 'POST' || req.method === 'DELETE')) {
    sendJson(res, { code: 0, message: 'ok', data: null })
    return
  }

  if (pathname === `${API_PREFIX}/follows/` && req.method === 'GET') {
    sendJson(res, { code: 1, message: '未关注', data: null })
    return
  }

  if (pathname === `${API_PREFIX}/follows/` && (req.method === 'POST' || req.method === 'DELETE')) {
    sendJson(res, { code: 0, message: 'ok', data: null })
    return
  }

  if (pathname.startsWith(`${API_PREFIX}/favorites/folder/`) && req.method === 'GET') {
    sendJson(res, { code: 0, message: 'ok', data: favoriteFolders })
    return
  }

  if (pathname.startsWith(`${API_PREFIX}/favorites/videoId/`) && req.method === 'GET') {
    sendJson(res, { code: 1, message: '未收藏', data: null })
    return
  }

  if (pathname === `${API_PREFIX}/favorites/batch` && req.method === 'POST') {
    sendJson(res, { code: 0, message: 'ok', data: null })
    return
  }

  if (pathname.startsWith(`${API_PREFIX}/videos/share`) && req.method === 'POST') {
    sendJson(res, { code: 0, message: 'ok', data: null })
    return
  }

  sendJson(
    res,
    {
      code: 1,
      message: `Unhandled mock route: ${req.method} ${pathname}`,
    },
    { status: 404 }
  )
})

server.listen(PORT, HOST, () => {
  console.log(`Mock API listening at http://${HOST}:${PORT}${API_PREFIX}`)
})
