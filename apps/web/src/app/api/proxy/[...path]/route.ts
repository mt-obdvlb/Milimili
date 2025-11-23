import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

async function proxy(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const path = url.pathname.replace('/api/proxy', '')

    const target = `${process.env.NEXT_PUBLIC_API_URL}${path}${url.search}`
    console.log('proxy ->', target)

    const headers: Record<string, string> = {}

    // 拿到客户端 Cookies（SSR 时只能手动获取）
    const cookieStore = await cookies()
    const cookieString = cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join('; ')

    if (cookieString) {
      headers['Cookie'] = cookieString
    }

    // 保留客户端原有 header（不要覆盖 Cookie）
    req.headers.forEach((v, k) => {
      if (k.toLowerCase() !== 'cookie') headers[k] = v
    })

    let body: string | undefined
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      body = await req.text()
    }

    const response = await fetch(target, {
      method: req.method,
      headers,
      body,
    })

    const resultBuffer = await response.arrayBuffer()
    const res = new NextResponse(Buffer.from(resultBuffer), {
      status: response.status,
    })

    response.headers.forEach((value, key) => {
      res.headers.set(key, value)
    })

    return res
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ code: 1, message }, { status: 500 })
  }
}

export { proxy as GET, proxy as POST, proxy as PUT, proxy as DELETE }
