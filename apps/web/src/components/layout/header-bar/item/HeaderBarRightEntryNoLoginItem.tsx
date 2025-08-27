import { useUiStore } from '@/stores'

const HeaderBarRightEntryNoLoginItem = ({ title }: { title: string }) => {
  const setLoginModel = useUiStore((state) => state.setLoginModel)

  return (
    <div className={'w-[359px] rounded-[8px] px-5 py-5.5 text-left'}>
      <p className={'text-text3 mb-6 text-center text-sm leading-5'}>{`登录即可查看${title}`}</p>
      <div
        onClick={() => setLoginModel(true)}
        className={
          'relative block h-10 cursor-pointer rounded-[8px] py-2.5 text-center text-[0px] leading-5 tracking-normal text-white'
        }
      >
        <div className={'bg-brand_blue absolute inset-0 rounded-[8px]'}></div>
        立即登录
        <div className={'absolute inset-0 text-sm leading-10'}>立即登录</div>
      </div>
    </div>
  )
}

export default HeaderBarRightEntryNoLoginItem
