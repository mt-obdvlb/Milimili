import HeaderBarTypeTwoWrapper from '@/components/layout/header/header-bar/HeaderBarTypeTwoWrapper'
import AccountWrapper from '@/features/account/components/AccountWrapper'

const AccountPage = () => {
  return (
    <>
      <header>
        <HeaderBarTypeTwoWrapper />
      </header>
      <div className={'min-h-[500px] relative'}>
        <div className={"w-full h-[106px] bg-[url('/images/account-repeat.png')] bg-repeat-x "}>
          <div
            className={
              "w-[980px] h-[106px] mx-auto bg-[url('/images/account-bg.png')] bg-no-repeat"
            }
          ></div>
        </div>
        <div
          className={
            'overflow-hidden min-h-[890px] w-[829px] h-full mt-2.5 mb-25 mx-auto border border-[#e1e2e5] shadow-[0_2px_4px_rgba(0,0,0,.14)] bg-[#fafafa] rounded-[4px]'
          }
        >
          <AccountWrapper />
        </div>
      </div>
    </>
  )
}

export default AccountPage
