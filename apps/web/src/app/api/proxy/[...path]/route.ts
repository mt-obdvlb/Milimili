import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic' // 强制动态渲染

async function proxy(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const path = url.pathname.replace('/api/proxy', '') // 去掉前缀
    const target = `${process.env.NEXT_PUBLIC_API_URL}${path}${url.search}`

    const headers = Object.fromEntries(req.headers.entries())
    let body: string | undefined

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      body = await req.text()
    }

    const response = await fetch(target, {
      method: req.method,
      headers,
      body,
    })

    const data = await response.arrayBuffer()
    const res = new NextResponse(Buffer.from(data), {
      status: response.status,
    })

    response.headers.forEach((value, key) => {
      res.headers.set(key, value)
    })

    return res
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Proxy error'
    return NextResponse.json({ code: 1, message: message }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  return proxy(req)
}
export async function POST(req: NextRequest) {
  return proxy(req)
}
export async function PUT(req: NextRequest) {
  return proxy(req)
}
export async function DELETE(req: NextRequest) {
  return proxy(req)
}
