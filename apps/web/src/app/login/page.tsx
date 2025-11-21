import LoginWrapper from '@/features/login/components/LoginWrapper'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '登录',
}

const Login = () => {
  return (
    <div className={'mx-auto min-w-[1100px] max-w-[2560px] min-h-[calc(100vh-540px)] bg-white'}>
      <div className={'w-full h-[106px] bg-[linear-gradient(#2ca0d8,#2ca0d8_86px,#fff_0,#fff)]'}>
        <div
          className={"w-[980px] h-[106px] mx-auto bg-[url('/images/login-top.png')] bg-no-repeat"}
        ></div>
      </div>
      <div className={'mx-auto pt-2.5 '}>
        <div className={'w-[405px] mx-auto pt-[82px] pb-[108px]'}>
          <LoginWrapper />
        </div>
      </div>
    </div>
  )
}

export default Login
