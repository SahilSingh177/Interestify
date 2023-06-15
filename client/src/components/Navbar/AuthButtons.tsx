import React from "react";
import { useEffect } from "react";
import Link from 'next/link';
import { Button } from "@chakra-ui/react";
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { authState } from '../../atoms/userAtom'
import { auth } from "@/firebase/clientApp";
import { useAuthState, useSignOut } from 'react-firebase-hooks/auth'
import MenuDropDown from "./MenuDropDown";

const AuthButtons = () => {
  const userState = useRecoilValue(authState);
  const { isLoggedIn } = userState;
  const setUserState = useSetRecoilState(authState)
  const [_, loadingAuthState, loadingAuthError] = useAuthState(auth);
  const [signOut, loading, error] = useSignOut(auth);


  useEffect(() => {
    if (auth) {
      setUserState((prevState) => ({
        ...prevState,
        isLoggedIn:( auth.currentUser!=null)?true:false,
      }));
    }
  }, [auth])


  const handleSignOut = async () => {
    await signOut();
    while (loadingAuthState) {
      if (loadingAuthError) {
        console.log("Couldn't set auth state")
        return;
      }
    }
    setUserState((prevState) => ({
      ...prevState,
      isLoggedIn: false,
    }));
    console.log("SIGNED OUT");
  };

  return (
    <>
      {!isLoggedIn && <Button
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

      {!isLoggedIn && <Button
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

      {isLoggedIn &&
        <MenuDropDown handleSignOut={handleSignOut} />
      }
    </>
  );
};

export default AuthButtons
