import React, { createContext, useEffect, useState } from 'react';
import { auth } from '../firebase/clientApp';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Flex } from '@chakra-ui/react'

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, loading, error] = useAuthState(auth);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (!loading) {
      setCurrentUser(user);
      console.log("PROVIDER:");
      console.log(user);

      if (user && user.email) {
        localStorage.setItem('email', user.email);
      }
      
    }
  }, [loading, user]);

  if (loading) {
    return (
      <Flex flexDirection='column' alignItems='center' justifyContent='center' height='100vh' width="100vw">
        <iframe src="/assets/dragon.gif" style={{ border: 'none', width: 'auto', height: '60vh' }}></iframe>
      </Flex>
    );
  }

  return (
    <AuthContext.Provider value={currentUser}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
