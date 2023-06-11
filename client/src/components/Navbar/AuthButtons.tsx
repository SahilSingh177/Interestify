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
        size="lg"
        height="28px"
        display={{ base: "none", sm: "flex" }}
        width={{ base: "70px", md: "110px" }}
        mr={2}
        // onClick={() => setAuthModalState({ open: true, view: "login" })}
      >
        Log In
      </Button>
      <Button
        variant="transparent"
        size="lg"
        height="28px"
        display={{ base: "none", sm: "flex" }}
        width={{ base: "70px", md: "110px" }}
        mr={2}
        // onClick={() => setAuthModalState({ open: true, view: "signup" })}
      >
        Sign Up
      </Button>
    </>
  );
};

export default AuthButtons
