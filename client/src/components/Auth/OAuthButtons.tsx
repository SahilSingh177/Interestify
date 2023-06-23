import React, { useState, useContext } from 'react';
import { Button, Avatar } from '@chakra-ui/react';
import { auth } from '@/firebase/clientApp';
import { useSignInWithEmailAndPassword, useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { useSignInWithFacebook } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/router';
import { AuthContext } from '@/Providers/AuthProvider';

type Props = {
  imageSrc: string;
  providerName: string;
};

const OauthButtons = ({ imageSrc, providerName }: Props) => {
  const [signInWithGoogle, guser, gloading, gerror] = useSignInWithGoogle(auth);
  const [signInWithFacebook, fuser, floading, ferror] = useSignInWithFacebook(auth);

  const Router = useRouter();
  const onSubmit = async () => {
    if (providerName === 'Google') {
      await signInWithGoogle();
      if (gerror) {
        console.log(gerror);
        return;
      }
    } else {
      await signInWithFacebook();
      if (ferror) {
        console.log(ferror);
        return;
      }
    }
    
    await new Promise<void>((resolve) => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          unsubscribe();
          resolve();
        }
      });
    });
    
    const isNewUser =
    auth.currentUser?.metadata.creationTime === auth.currentUser?.metadata.lastSignInTime;
  
    if (isNewUser && auth.currentUser) {
      await fetch('https://nikhilranjan.pythonanywhere.com/registerUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: auth.currentUser.email, username: auth.currentUser.displayName }),
      });
      Router.push('/welcome/categories');
    } else {
      Router.push('/');
    }
  };
  
  

  return (
    <Button
      variant="oauth"
      mb={2}
      height={['8vh','8vh','8vh','10vh']}
      width={['75vw','75vw','75vw','25vw']}
      fontSize={['lg','2xl','2xl','lg']}
      onClick={onSubmit}
    >
      <Avatar src={imageSrc} size={{ base: 'xs', md: 'sm' }} mr={4} />
      Login with {providerName}
    </Button>
  );
};

export default OauthButtons;
