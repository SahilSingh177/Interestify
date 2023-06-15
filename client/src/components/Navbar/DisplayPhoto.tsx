import { Avatar, forwardRef, BoxProps, Box } from '@chakra-ui/react';
import { auth } from '@/firebase/clientApp';

type Props = {};

const DisplayPhoto = forwardRef<BoxProps, 'div'>((props, ref) => {
  let imageURL = auth.currentUser?.photoURL || undefined;
  if(!imageURL) imageURL = '/assets/default_profile_photo.png'
  return <Box ref={ref} {...props}><Avatar src={imageURL} cursor="pointer" /></Box>;
});

export default DisplayPhoto;
