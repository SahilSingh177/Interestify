import React from 'react';
import { Button, Avatar } from '@chakra-ui/react';
import { auth } from '@/firebase/clientApp';
import { useSignInWithGoogle } from 'react-firebase-hooks/auth';
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
    providerName === "Google" ? await signInWithGoogle() : await signInWithFacebook();
    if (gerror) {
      console.log(gerror);
      return;
    }
    if (ferror) {
      console.log(ferror);
      return;
    }

    await fetch("http://127.0.0.1:5000/registerUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: auth.currentUser?.email, username: auth.currentUser?.displayName }),
    })

    Router.push("http://localhost:3000/welcome/categories");
  };

  return (
    <Button variant="oauth" mb={2} height="10vh" fontSize={{lg:"lg",md:"md",sm:"sm",base:'x-small'}}
      onClick={onSubmit}>
      <Avatar src={imageSrc} size={{base:"xs",md:'sm'}} mr={4} />
      Login with {providerName}
    </Button>
  );
};

export default OauthButtons;
