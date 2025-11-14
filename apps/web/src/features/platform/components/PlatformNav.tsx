'use client'

import Link from 'next/link'
import { FileVideoCamera, Upload } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib'

const PlatformNav = () => {
  const pathname = usePathname()

  return (
    <div>
      <div className={'mt-6 w-[136px] mb-[17px] mx-auto '}>
        <Link
          href={`/apps/web/src/app/(with-auth)/platform/upload`}
          className={
            'rounded-[2px] text-[16px]  text-white block text-center leading-10 bg-brand_blue cursor-pointer hover:opacity-90'
          }
        >
          <Upload className={'inline-block mr-2 text-[18px] size-[18px]'} />
          投稿
        </Link>
      </div>
      <div className={'relative text-[16px] leading-6 cursor-pointer'}>
        <div className={'h-[46px] flex items-center cursor-pointer'}>
          <Link
            href={'/apps/web/src/app/(with-auth)/platform/upload-manager'}
            className={cn(
              'text-text1 pl-8 pr-6 size-full flex items-center hover:bg-graph_bg_thin',
              pathname === '/platform/upload-manager' ? 'text-brand_blue' : ''
            )}
          >
            <FileVideoCamera
              className={cn(
                'inline-block mr-5 text-[20px] size-5 text-[#757575]',
                pathname === '/platform/upload-manager' ? 'text-brand_blue' : ''
              )}
            />
            <span className={'w-[90px] inline-block relative text-sm'}>稿件管理</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default PlatformNav
