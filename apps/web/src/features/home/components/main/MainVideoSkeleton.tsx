'use client'

import React, { forwardRef } from 'react'

const MainVideoSkeleton = forwardRef<SVGSVGElement | null>((props, ref) => {
  return (
    <svg
      className={'mt-[20px] h-full w-full'}
      viewBox='0 0 300 220'
      xmlns='http://www.w3.org/2000/svg'
      ref={ref}
      {...props}
    >
      <defs>
        <linearGradient id='diagonal-shimmer' x1='0' y1='0' x2='1' y2='1'>
          <stop offset='0%' stopColor='#f3f3f3' />
          <stop offset='50%' stopColor='#ecebeb' />
          <stop offset='100%' stopColor='#f3f3f3' />
          <animateTransform
            attributeName='gradientTransform'
            type='translate'
            from='-1 -1'
            to='2 2'
            dur='2s'
            repeatCount='indefinite'
          />
        </linearGradient>
      </defs>

      <rect x='0' y='0' rx='8' ry='8' width='300' height='170' fill='url(#diagonal-shimmer)' />
      <rect x='0' y='180' rx='4' ry='4' width='240' height='12' fill='url(#diagonal-shimmer)' />
      <rect x='0' y='200' rx='4' ry='4' width='180' height='12' fill='url(#diagonal-shimmer)' />
      <circle cx='270' cy='190' r='15' fill='url(#diagonal-shimmer)' />
    </svg>
  )
})

export default MainVideoSkeleton
