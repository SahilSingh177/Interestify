import { Button, Flex, Image, Text, Avatar } from '@chakra-ui/react';
import React from 'react';
import { auth } from '@/firebase/clientApp';
import { useAuthState, useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { useSignInWithFacebook } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/router';
import { authState } from '@/atoms/userAtom';
import { useSetRecoilState } from "recoil";

type Props = {
  imageSrc: string;
  providerName: string;
};

const OauthButtons = ({ imageSrc, providerName }: Props) => {
  const setUserState = useSetRecoilState(authState);
  const [signInWithGoogle, guser, gloading, gerror] = useSignInWithGoogle(auth);
  const [signInWithFacebook, fuser, floading, ferror] = useSignInWithFacebook(auth);
  const [_, loadingAuthState, loadingAuthError] = useAuthState(auth);

  const Router = useRouter();

  const waitForCurrentUser = () => {
    while(loadingAuthState){
      if(loadingAuthError){
        console.log("Couldn't set auth state")
        return;
      }
    }
    setUserState((prevState) => ({
      ...prevState,
      isLoggedIn: true,
      currentUser: guser?.user,
    }));
    if(guser?.user)console.log(guser?.user.displayName);

  };

  const onSubmit = async () => {
    if (providerName === "Google") {
      await signInWithGoogle();
    } else {
      await signInWithFacebook();
    }
  
    if (gerror) {
      console.log(gerror);
      return;
    }
    if (ferror){
      console.log(ferror);
      return;
    }
    else {
      waitForCurrentUser();
      Router.push("/select-preferences");
    }
  };

  return (
    <Button variant="oauth" mb={2} width="20vw" height="10vh" fontSize="md"
      onClick={onSubmit}>
      <Avatar src={imageSrc} size="sm" mr={4} />
      Login with {providerName}
    </Button>
  );
};

export default OauthButtons;
