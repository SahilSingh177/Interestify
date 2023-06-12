import { Button, Flex, Image } from '@chakra-ui/react';
import React from 'react';
import { auth } from '@/firebase/clientApp';
import { useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { useSignInWithFacebook } from 'react-firebase-hooks/auth';

type Props = {
  imageSrc: string;
  providerName: string;
};

const OauthButtons = ({ imageSrc, providerName }: Props) => {
  const [signInWithGoogle, guser, gloading, gerror] = useSignInWithGoogle(auth);
  const [signInWithFacebook, fuser, floading, ferror] = useSignInWithFacebook(auth);

  return (
    <Button variant="oauth" mb={2} width="25vw" height="10vh" size="lg"
      onClick={() => providerName === "google" ? signInWithGoogle() : signInWithFacebook()}>
      <Image src={imageSrc} height="30px" mr={1} />
      Login with {providerName}
    </Button>
  );
};

export default OauthButtons;
