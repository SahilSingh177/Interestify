import React from "react";
import { useEffect, useState, useContext } from 'react';
import { AuthContext } from "@/Providers/AuthProvider";
import { useRouter } from "next/router";
import { Flex, Image } from "@chakra-ui/react";
import AuthButtons from "./AuthButtons";
import Link from 'next/link';
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
      setIsScrolledPastThreshold(currentPosition > 80 + (window.innerHeight * 0.50));
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
      width="100vw"
      maxWidth="100vw"
      height="80px"
      padding="10px 5vw"
      zIndex="200"
      justifyContent="space-between"
      alignItems="center"
      overflowX="hidden"
      overflowY="hidden"
    >
      <Link href="/">
        {/* <Text fontWeight="extrabold" fontSize="5xl">
          Interestify
        </Text> */}
        {/* <Icon></Icon> */}
        <Image src="/assets/logo-no-background.svg" height="80px" transform="scale(1.3)"></Image>

      </Link>
        <SearchBar></SearchBar>
      <Flex>
        <AuthButtons />
      </Flex>
    </Flex>
  );
};


export default Navbar;
