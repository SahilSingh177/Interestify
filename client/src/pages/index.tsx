import React from 'react'
import { Stack } from '@chakra-ui/react'
import Banner from '@/components/Navbar/Banner'
import Blogs from '@/components/Blogs/Blogs'

type Props = {}

const index: React.FC = (props: Props) => {
  return (
    <>
      <Stack>
        <Banner></Banner>
        <Blogs></Blogs>
      </Stack>
    </>
  )
}
export const revalidate = false
export default index