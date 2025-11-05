import { UserGetInfo } from '@mtobdvlb/shared-types'
import Link from 'next/link'
import Image from 'next/image'

const SpaceHeader = ({ user }: { user: UserGetInfo }) => {
  return (
    <div className={'h-[200px] relative flex'}>
      <div className={'pointer-events-none -z-1 absolute inset-0'}>
        <div
          className={
            "bg-[url('/images/space-bg.png')] bg-[center_top] size-full bg-bg3 bg-no-repeat bg-cover"
          }
        ></div>
      </div>
      <div className={'pointer-events-none -z-1 absolute inset-0'}>
        <div
          className={
            'absolute inset-x-0 top-0 h-[106px] bg-[linear-gradient(180deg,rgba(0,0,0,.7),rgba(0,0,0,0))]'
          }
        ></div>
        <div
          className={
            'absolute inset-x-0 bottom-0 h-[117px] bg-[linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,.5))]'
          }
        ></div>
      </div>
      <div
        className={
          'max-w-[2260px] mx-auto w-full px-15 self-end pb-[30px] h-fit flex justify-between'
        }
      >
        <div className={'flex-1 flex items-center mr-5'}>
          <div className={'shrink-0 h-[1px] mr-[22px] flex items-center justify-center'}>
            <div className={'relative border-2 cursor-pointer border-white/40 rounded-full '}>
              <div className={'size-16 overflow-hidden'}>
                <Image
                  className={'rounded-full'}
                  src={user.avatar}
                  alt={'头像'}
                  height={64}
                  width={64}
                />
              </div>
              <Link
                target={'_blank'}
                href={'/account'}
                className={
                  'absolute inset-0 rounded-full bg-black/50 flex items-center justify-center text-text_white text-sm opacity-0 transition-opacity duration-300 hover:opacity-100'
                }
              >
                更换头像
              </Link>
            </div>
          </div>
          <div className={'flex-1'}>
            <div className={'flex items-center'}>
              <div
                className={
                  'text-[24px] font-bold text-text_white mr-2 text-shadow-[0_1px_2px_rgba(0,0,0,.4)]'
                }
              >
                {user.name}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SpaceHeader
