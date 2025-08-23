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
        pathname: '/milimili/**', // ** 表示匹配任意子路径
      },
    ],
  },
}

export default nextConfig
