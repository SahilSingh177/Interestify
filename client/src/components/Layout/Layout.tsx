import React from 'react'
import Navbar from '../Navbar/Navbar'
import { Flex, Divider } from '@chakra-ui/react'

type Props = {}

const Layout = ({ children }: React.PropsWithChildren<Props>) => {
  return (
    <>
      <Navbar />
      <Flex height="80px"></Flex>
      <Divider
        orientation="horizontal"
        size="5px"
        bg="black"
        borderColor="black"
        position="fixed"
        zIndex="1"
      />
      {children}
    </>
  )
}

export default Layout
