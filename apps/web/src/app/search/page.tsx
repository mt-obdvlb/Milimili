import HeaderBarTypeTwoWrapper from '@/components/layout/header/header-bar/HeaderBarTypeTwoWrapper'

const Search = async ({ searchParams }: { searchParams: Promise<{ kw: string }> }) => {
  const { kw } = await searchParams
  console.log(kw)
  return (
    <>
      <header>
        <HeaderBarTypeTwoWrapper hidden />
      </header>
    </>
  )
}

export default Search
