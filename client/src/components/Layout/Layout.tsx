import React from 'react'
import { useRouter } from 'next/router'
import Navbar from '../Navbar/Navbar'
import { Flex, Divider } from '@chakra-ui/react'

type Props = {}

const Layout = ({ children }: React.PropsWithChildren<Props>) => {
  const router = useRouter();
  const relativeUrl = router.asPath;
  const currentUrl = 'http://localhost:3000'+relativeUrl;

  const hiddenUrls = [
    'http://localhost:3000/welcome/categories',
    'http://localhost:3000/welcome/select-mail'
  ];
  const shouldHideNavbar = hiddenUrls.includes(currentUrl);

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      {!shouldHideNavbar && <Flex height="10vh"></Flex>}
      {!shouldHideNavbar && <Divider
        orientation="horizontal"
        bg="black"
        borderColor="black"
        position="fixed"
        zIndex="1"
      />}
      {children}
    </>
  )
}

export default Layout
