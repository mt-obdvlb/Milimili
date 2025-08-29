'use client'

import Link from 'next/link'
import { FaGithub } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className={'bg-bg3 py-[30px]'}>
      <div className='container mx-auto flex flex-col items-center gap-6 px-4'>
        <div className='flex flex-col items-center gap-2'>
          <Link href='/' className='text-2xl font-bold text-gray-800'>
            Milimili
          </Link>
          <a
            href='https://github.com/mt-obdvlb/milimili'
            target='_blank'
            rel='noopener noreferrer'
            className='flex items-center gap-1 text-gray-500 hover:text-gray-800'
          >
            <FaGithub /> GitHub
          </a>
        </div>

        <div className='mt-6 text-center text-sm text-gray-500'>
          © {new Date().getFullYear()} Milimili.
        </div>
      </div>
    </footer>
  )
}

export default Footer
