import React, { createContext, useEffect, useState } from 'react';
import { auth } from '../firebase/clientApp';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Flex } from '@chakra-ui/react';
import { Player } from '@lottiefiles/react-lottie-player';

interface User {
  email: string | null | undefined,
  photoURL: string | null | undefined,
  displayName: string | null | undefined,
}

const AuthContext = createContext<User | null | undefined>(null);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, loading, error] = useAuthState(auth);
  const [currentUser, setCurrentUser] = useState<User | null>(null);


  useEffect(() => {
    if (!loading) {
      setCurrentUser({ email: user?.email, photoURL: user?.email, displayName: user?.displayName });
      console.log('PROVIDER:');
      console.log(user);

      if (user && user.email) {
        localStorage.setItem('email', user.email);
      }
    }
  }, [loading, user]);

  if (loading) {
    return (
      <Flex flexDirection="column" alignItems="center" justifyContent="center" height="95vh" width="100%">
        <Player
          autoplay
          loop
          src="/loading.json"
          style={{ height: '80%', width: '80%' }}
        />
      </Flex >
    );
  }

return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};

export { AuthProvider, AuthContext };
