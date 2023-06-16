import { useState, useEffect } from 'react'
import { Avatar, forwardRef, BoxProps, Box } from '@chakra-ui/react';
import { auth } from '@/firebase/clientApp';

const DisplayPhoto = forwardRef<BoxProps, 'div'>((props, ref) => {
  const [imageURL, setImageURL] = useState<string | undefined>('/assets/default_profile_photo.png');

  useEffect(() => {
    if(auth){
      const displayPhoto = auth.currentUser?.photoURL;
      if(displayPhoto) setImageURL(displayPhoto);     
    }
  }, [auth])
  
  return <Box ref={ref} {...props}><Avatar src={imageURL} cursor="pointer" /></Box>;
});

export default DisplayPhoto;
