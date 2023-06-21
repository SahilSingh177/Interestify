import React, { useState } from 'react';
import { Button, Avatar } from '@chakra-ui/react';
import { auth } from '@/firebase/clientApp';
import { useSignInWithEmailAndPassword, useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { useSignInWithFacebook } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/router';

type Props = {
  imageSrc: string;
  providerName: string;
};

const OauthButtons = ({ imageSrc, providerName }: Props) => {
  const [signInWithGoogle, guser, gloading, gerror] = useSignInWithGoogle(auth);
  const [signInWithFacebook, fuser, floading, ferror] = useSignInWithFacebook(auth);

  const Router = useRouter();
  const onSubmit = async () => {
    const redirectRoute =
      providerName === 'Google' ? await signInWithGoogle() : await signInWithFacebook();

    if (gerror) {
      console.log(gerror);
      return;
    }
    if (ferror) {
      console.log(ferror);
      return;
    }

    // Check if the user is new
    const isNewUser = auth.currentUser?.metadata.creationTime ===
                      auth.currentUser?.metadata.lastSignInTime;

    if (isNewUser) {
      // User signed in for the first time
      Router.push('/welcome/categories');
    } else {
      // Existing user
      Router.push('/');
    }
  };

  return (
    <Button
      variant="oauth"
      mb={2}
      height="10vh"
      fontSize={{ lg: 'lg', md: 'md', sm: 'sm', base: 'x-small' }}
      onClick={onSubmit}
    >
      <Avatar src={imageSrc} size={{ base: 'xs', md: 'sm' }} mr={4} />
      Login with {providerName}
    </Button>
  );
};

export default OauthButtons;
