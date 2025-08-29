import HeaderBarTypeTwoWrapper from '@/components/layout/header/header-bar/HeaderBarTypeTwoWrapper'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import Image from 'next/image'
import FindPasswordContent from '@/features/find-password/components/FindPasswordContent'

const FindPassword = () => {
  return (
    <>
      <header>
        <HeaderBarTypeTwoWrapper />
      </header>
      <main
        className={
          'min-h-[calc(100vh-540px) mx-auto max-w-[2560px] min-w-[1100px] bg-white align-baseline font-normal'
        }
      >
        <div className={'h-[106px] w-full bg-[linear-gradient(#2ca0d8,#2ca0d8_86px,#fff_0,#fff)]'}>
          <div className={"mx-auto h-[106px] w-[980px] bg-[url('/images/rl_top.png')]"}></div>
        </div>
        <div className={'mx-auto py-2.5'}>
          <div className={'mx-auto mt-[26px] min-h-[424px] w-[952px] pb-15'}>
            <Breadcrumb className={'flex w-full items-center'}>
              <BreadcrumbList className={'flex w-full items-center gap-2'}>
                <BreadcrumbItem className={'leading-5 text-[#18191c]'}>登录</BreadcrumbItem>
                <BreadcrumbSeparator>
                  <Image src={'/svgs/r_arrow.svg'} alt={'r_arrow'} height={12} width={12} />
                </BreadcrumbSeparator>
                <BreadcrumbItem className={'leading-5 text-[#61666d]'}>忘记密码</BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <FindPasswordContent />
          </div>
        </div>
      </main>
    </>
  )
}

export default FindPassword
