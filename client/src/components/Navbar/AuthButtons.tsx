import { Button } from "@chakra-ui/react";
import React, { useState } from "react";
// import { useSetRecoilState } from "recoil";
// import { authModalState } from "../../../atoms/authModalAtom";
// import AuthModal from "../../Modal/AuthModal";

const AuthButtons= () => {
//   const setAuthModalState = useSetRecoilState(authModalState);

  return (
    <>
      <Button
        variant="transparent"
        size="md"
        bg="none"
        color="black"
        height="45px"
        display={{ base: "none", sm: "flex" }}
        width={{ base: "120", md: "110px" }}
        mr={2}
        // onClick={() => setAuthModalState({ open: true, view: "login" })}
      >
        Sign In
      </Button>
      <Button
        variant="success"
        bg="green.400"
        size="md"
        height="45px"
        display={{ base: "none", sm: "flex" }}
        width={{ base: "120px", md: "110px" }}
        // onClick={() => setAuthModalState({ open: true, view: "signup" })}
      >
        Get Started
      </Button>
    </>
  );
};

export default AuthButtons
