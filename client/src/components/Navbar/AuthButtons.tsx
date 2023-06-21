import React from "react";
import { useContext } from "react";
import Link from 'next/link';
import { Button } from "@chakra-ui/react";
import { auth } from "@/firebase/clientApp";
import { useSignOut } from 'react-firebase-hooks/auth'
import MenuDropDown from "./MenuDropDown";
import { AuthContext } from "@/Providers/AuthProvider";

const AuthButtons = () => {
  const currentUser = useContext(AuthContext);


  return (
    <>
      {!currentUser && <Button
        as={Link}
        href="/login"
        variant="transparent"
        size="lg"
        fontWeight="bold"
        bg="none"
        color="black"
        height="45px"
        display={{ base: "none", sm: "flex" }}
        width={{ base: "120px", md: "110px" }}
        mr={2}
      >
        Sign In
      </Button>}

      {!currentUser && <Button
        as={Link}
        href="/signup"
        variant="success"
        size="lg"
        height="45px"
        display={{ base: "none", sm: "flex" }}
        width={{ base: "120px", md: "110px" }}
      >
        Get Started
      </Button>}

      {currentUser &&
        <MenuDropDown/>
      }
    </>
  );
};

export default AuthButtons
