import React from "react";
import { useEffect, useState, useContext } from 'react';
import { AuthContext } from "@/Providers/AuthProvider";
import { useRouter } from "next/router";
import { Flex, Box } from "@chakra-ui/react";
import AuthButtons from "./AuthButtons";
import Link from 'next/link';
import Image from "next/image";
import SearchBar from "./SearchBar";

const Navbar: React.FC = () => {
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
      <Flex height='10vh' width={currentUser?.email?['25vh','25vh','25vh','18vh']:['15vh','15vh','16vh','16vh']}  alignItems='center' justifyContent='center'>

      <Link href="/">
        <Image priority={true} src="/assets/logo-no-background.svg" alt='logo'height='326' width='557'></Image>
      </Link>
      </Flex>
        <SearchBar></SearchBar>
      <Flex justifyContent='center'>
        <AuthButtons />
      </Flex>
    </Flex>
  );
};


export default Navbar;
