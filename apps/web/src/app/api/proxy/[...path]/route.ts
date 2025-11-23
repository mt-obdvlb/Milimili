import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

async function proxy(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const path = url.pathname.replace('/api/proxy', '')
    const target = `${process.env.NEXT_PUBLIC_API_URL}${path}${url.search}`

    console.log('proxy ->', target)

    // 拿到 SSR Cookie
    const cookieStore = await cookies()
    const cookieString = cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join('; ')

    const headers: Record<string, string> = {}
    if (cookieString) headers['Cookie'] = cookieString

    // 保留原有 header（不要覆盖 Cookie）
    req.headers.forEach((v, k) => {
      if (k.toLowerCase() !== 'cookie') headers[k] = v
    })

    let body: string | undefined
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      body = await req.text()
    }

    // 调用后端
    const response = await fetch(target, {
      method: req.method,
      headers,
      body,
    })

    // 把 body 读取为 buffer
    const resultBuffer = await response.arrayBuffer()
    const res = new NextResponse(Buffer.from(resultBuffer), {
      status: response.status,
    })

    // 转发普通 headers
    response.headers.forEach((value, key) => {
      if (key.toLowerCase() !== 'set-cookie') {
        res.headers.set(key, value)
      }
    })

    // 单独转发 Set-Cookie
    const setCookie = response.headers.get('set-cookie')
    if (setCookie) {
      // 多个 cookie 用数组
      const cookiesArray = setCookie.split(/,(?=[^;]+=[^;]+)/) // 分割多个 cookie
      cookiesArray.forEach((c) => res.headers.append('Set-Cookie', c))
    }

    return res
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ code: 1, message }, { status: 500 })
  }
}

export { proxy as GET, proxy as POST, proxy as PUT, proxy as DELETE }
