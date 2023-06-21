import React, { useContext } from 'react';
import { AuthContext } from '@/Providers/AuthProvider';
import {
  Card,
  CardBody,
  Image,
  Stack,
  Heading,
  Text,
  Divider,
  CardFooter,
  Button
} from '@chakra-ui/react';

const UserCard = () => {
  const currentUser = useContext(AuthContext);
  let imageURL = currentUser?.photoURL || undefined;
  if (!imageURL) imageURL = '/assets/default_profile_photo.png';
  let displayName = currentUser?.displayName;
  let userEmail = currentUser?.email;

  return (
    <Card borderRadius={20} width="full" maxH='50%'>
      <CardBody display="flex" justifyContent={['space-around']}>
        <Image
          src={imageURL}
          alt='Profile Photo'
          borderRadius='lg'
        />
        <Stack spacing='3'>
          <Heading size={['sm', 'sm', 'md', 'md']}>{displayName}</Heading>
          <Text fontSize={['x-small', 'sm', 'md', 'md']}>
            <Text color="gray.600">Signed in as</Text>
            {userEmail}
          </Text>
        <Button marginLeft={0} variant='solid' size={['sm','sm','md','md']}>
          Edit Profile
        </Button>
        </Stack>
      </CardBody>
    </Card>
  );
};

export default UserCard;
