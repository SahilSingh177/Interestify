import { useState, useEffect, useContext } from 'react'
import { Avatar, forwardRef, BoxProps, Box } from '@chakra-ui/react';
import { AuthContext } from '@/Providers/AuthProvider'
import { auth } from '@/firebase/clientApp';

const DisplayPhoto = forwardRef<BoxProps, 'div'>((props, ref) => {
  const currentUser = useContext(AuthContext);
  let imageURL = currentUser.photoURL || undefined;
  if (!imageURL) imageURL = '/assets/default_profile_photo.png'
  
  return <Box ref={ref} {...props}><Avatar src={imageURL} cursor="pointer" /></Box>;
});

export default DisplayPhoto;
