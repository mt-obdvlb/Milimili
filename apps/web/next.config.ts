import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mtobdvlb-web.oss-cn-beijing.aliyuncs.com',
        pathname: '/**',
      },
    ],
  },
  compiler: {
    // 生产环境去掉 console
    removeConsole: process.env.NODE_ENV === 'production',
  },
}

export default nextConfig
