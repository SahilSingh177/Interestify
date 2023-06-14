import { Button, Flex, Image } from '@chakra-ui/react';
import React from 'react';
import { auth } from '@/firebase/clientApp';
import { useSignInWithGoogle } from 'react-firebase-hooks/auth';
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

  const Router = useRouter();

  const waitForCurrentUser = () => {
    const unsubscribe = auth.onAuthStateChanged((guser) => {
      if (guser) {
        setUserState((prevState) => ({
          ...prevState,
          isLoggedIn: true,
          currentUser: guser,
        }));
        console.log(guser.email);
      }
    });
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
    <Button variant="oauth" mb={2} width="20vw" height="10vh" fontSize="xl"
      onClick={onSubmit}>
      <Image src={imageSrc} height="30px" mr={1} />
      Login with {providerName}
    </Button>
  );
};

export default OauthButtons;
