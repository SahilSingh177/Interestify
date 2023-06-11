import { Button } from "@chakra-ui/react";
import React, { useState } from "react";
import Link from 'next/link';

const AuthButtons = () => {

  return (
    <>
      <Button
        as={Link}
        href="/signup"
        variant="transparent"
        size="lg"
        fontWeight="bold"
        bg="none"
        color="black"
        height="45px"
        display={{ base: "none", sm: "flex" }}
        width={{ base: "120", md: "110px" }}
        mr={2}
      >
        Sign In
      </Button>
      <Button
        as={Link}
        href="/login"
        variant="success"
        bg="green.400"
        size="lg"
        height="45px"
        display={{ base: "none", sm: "flex" }}
        width={{ base: "120px", md: "110px" }}
      >
        Get Started
      </Button>
    </>
  );
};

export default AuthButtons
