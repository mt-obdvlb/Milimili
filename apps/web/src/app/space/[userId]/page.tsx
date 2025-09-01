const Space = async ({ params }: { params: Promise<{ userId: string }> }) => {
  console.log(await params)
  return <>SpaceLayout</>
}

export default Space
