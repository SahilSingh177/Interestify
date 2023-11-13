import React from 'react'
import Navbar from '../Navbar/Navbar'
import { Flex, Divider, useColorModeValue } from '@chakra-ui/react'
import Head from 'next/head'

type Props = {}

const Layout = ({ children }: React.PropsWithChildren<Props>) => {
  return (
    <>
      <Head>Interestify</Head>
      <Navbar />
      <Flex height="10vh"></Flex>
      <Divider
        orientation="horizontal"
        borderColor={useColorModeValue('gray.500','gray.100')}
        position="fixed"
        zIndex="1"
      />
      {children}
    </>
  )
}

export default Layout
