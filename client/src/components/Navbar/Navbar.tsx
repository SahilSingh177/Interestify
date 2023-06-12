import React from "react";
import { useEffect, useState } from 'react';
import { useRouter } from "next/router";
import { Box, Flex, Image, Text, Button, Divider, Stack } from "@chakra-ui/react";
import AuthButtons from "./AuthButtons";
import Banner from "./Banner";
import Link from 'next/link';

const Navbar: React.FC = () => {
  const router = useRouter();
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isScrolledPastThreshold, setIsScrolledPastThreshold] = useState(false);
  const isHomePage = router.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      const currentPosition = window.pageYOffset;
      setScrollPosition(currentPosition);
      setIsScrolledPastThreshold(currentPosition > 60 + (window.innerHeight * 0.50));
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <Flex
      bg={isHomePage && !isScrolledPastThreshold ? "#ffdf00" : "#f1f5f9"}
      position="fixed"
      width="100vw"
      maxWidth="100vw"
      height="80px"
      padding="10px 10vw"
      zIndex="200"
      justifyContent="space-between"
      alignItems="center"
      overflowX="hidden"
    >
      <Link href="/">
        <Text fontWeight="extrabold" fontSize="40px">
        Intrestify
        </Text>
        
      </Link>
      <Flex>
        <AuthButtons />
      </Flex>
    </Flex>
  );
};


export default Navbar;
