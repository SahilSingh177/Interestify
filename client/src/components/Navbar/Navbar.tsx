import React from "react";
import { useEffect, useState, useContext } from 'react';
import { AuthContext } from "@/Providers/AuthProvider";
import { useRouter } from "next/router";
import { Avatar, Flex, Image, useBreakpointValue } from "@chakra-ui/react";
import AuthButtons from "./AuthButtons";
import Link from 'next/link';
import SearchBar from "./SearchBar";

const Navbar: React.FC = () => {
  // const transformScale = useBreakpointValue({ base: 'scale(1.3)', md: 'scale(0.9)', sm: 'scale(0.7)',lg:'2.5' });
  const currentUser = useContext(AuthContext);
  const router = useRouter();
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isScrolledPastThreshold, setIsScrolledPastThreshold] = useState(false);
  const isHomePage = router.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      const currentPosition = window.pageYOffset;
      setScrollPosition(currentPosition);
      setIsScrolledPastThreshold(currentPosition >  window.innerHeight * 0.6);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <Flex
      bg={isHomePage && !currentUser && !isScrolledPastThreshold ? "#ffdf00" : "white"}
      position="fixed"
      width={['100vw','100vw','100vw',`calc(100vw - 12px)`]} 
      maxWidth="100vw"
      height="10vh"
      padding="10px 5vw"
      zIndex="200"
      justifyContent="space-between"
      alignItems="center"
      overflowX="hidden"
      overflowY="hidden"
    >
      <Link href="/">
        <Image src="/assets/logo-no-background.svg" height={['8vh','8vh','10vh','10vh']}></Image>

      </Link>
        <SearchBar></SearchBar>
      <Flex>
        <AuthButtons />
      </Flex>
    </Flex>
  );
};


export default Navbar;
