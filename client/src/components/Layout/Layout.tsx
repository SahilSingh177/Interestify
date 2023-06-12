import React from 'react'
import Navbar from '../Navbar/Navbar'
import Blogs from '../Blogs/Blogs'
import Banner from '../Navbar/Banner'
import { Flex } from '@chakra-ui/react'

type Props = {}

const Layout = ({ children }: React.PropsWithChildren<Props>) => {
  return (
    <>
      <Navbar />
      <Flex height="80px"></Flex>
      {children}
    </>
  )
}

export default Layout
