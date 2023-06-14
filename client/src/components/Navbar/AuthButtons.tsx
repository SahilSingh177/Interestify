import React from "react";
import Link from 'next/link';
import { Button, Box, Image, Menu, MenuButton, MenuList, MenuItem, IconButton, Icon } from "@chakra-ui/react";
import { AddIcon, EditIcon, ExternalLinkIcon, HamburgerIcon, RepeatIcon } from '@chakra-ui/icons'
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { authState } from '../../atoms/userAtom'
import { auth } from "@/firebase/clientApp";
import { SignOutHook, useAuthState, useSignOut } from 'react-firebase-hooks/auth'
// import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons'

const AuthButtons = () => {
  const userState = useRecoilValue(authState);
  const { isLoggedIn, currentUser } = userState;
  const setUserState = useSetRecoilState(authState)
  const [_, loadingAuthState, loadingAuthError] = useAuthState(auth);

  const [signOut, loading, error] = useSignOut(auth);
  const displayName = currentUser ? currentUser.displayName : "Not applicable";
  const displayPic = currentUser ? currentUser.photoUrl : "none";

  const handleSignOut = async () => {
    await signOut();
    waitForCurrentUser();
  };

  const waitForCurrentUser = () => {
    while(loadingAuthState){
      if(loadingAuthError){
        console.log("Couldn't set auth state")
        return;
      }
    }
    setUserState((prevState) => ({
      ...prevState,
      isLoggedIn: false,
      currentUser: null,
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
        width={{ base: "120", md: "110px" }}
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

      {isLoggedIn && <Button
        as={Link}
        href="/"
        variant=""
        size="lg"
        bg="red.500"
        color="white"
        height="45px"
        display={{ base: "none", sm: "flex" }}
        width={{ base: "120px", md: "110px" }}
        onClick={handleSignOut}
        isLoading={loading}
        marginRight="3vw"
      >
        Log Out
      </Button>}
      {isLoggedIn &&
        <Menu isLazy={true} strategy="fixed" >
          <MenuButton
            as={IconButton}
            aria-label='Options'
            icon={<HamburgerIcon />}
            variant='outline'
          />
          <MenuList>
            <MenuItem>
              Profile
            </MenuItem>
            <MenuItem>
              Activity
            </MenuItem>
            <MenuItem>
              Bookmarks
            </MenuItem>
            <MenuItem>
              History
            </MenuItem>
            <MenuItem onClick={handleSignOut} >
              Log Out
            </MenuItem>
          </MenuList>
        </Menu>
      }
    </>
  );
};

export default AuthButtons
