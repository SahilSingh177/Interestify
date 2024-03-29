import React from "react";
import { useContext } from "react";
import Link from "next/link";
import { Button } from "@chakra-ui/react";
import MenuDropDown from "./MenuDropDown";
import { AuthContext } from "@/Providers/AuthProvider";

const AuthButtons = () => {
  const currentUser = useContext(AuthContext);

  return (
    <>
      {!currentUser && (
        <Button
          as={Link}
          href="/login"
          variant="transparent"
          fontWeight="bold"
          bg="none"
          color="black"
          size={["sm", "sm", "md", "lg"]}
          mr={2}
        >
          Sign In
        </Button>
      )}

      {!currentUser && (
        <Button
          as={Link}
          href="/signup"
          variant="solid"
          fontWeight="semibold"
          size={["sm", "sm", "md", "lg"]}
        >
          Get Started
        </Button>
      )}

      {currentUser && <MenuDropDown />}
    </>
  );
};

export default AuthButtons;
