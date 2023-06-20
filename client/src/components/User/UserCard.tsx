import React, { useContext } from 'react';
import { AuthContext } from '@/Providers/AuthProvider';
import { Card, CardBody, Image, Stack, Heading, Text, Divider, CardFooter, Button} from '@chakra-ui/react'

const UserCard = () => {
const currentUser = useContext(AuthContext);
let imageURL = currentUser.photoURL || undefined;
if (!imageURL) imageURL = '/assets/default_profile_photo.png'
let displayName = currentUser.displayName;
let userEmail = currentUser.email;
  return (
    <Card borderRadius={50} width="full" height="50%">
    <CardBody>
        <Image
            src={imageURL}
            alt='Green double couch with wooden legs'
            borderRadius='lg'
            height="50%"
        />
        <Stack mt='6' spacing='3'>
            <Heading size='md'>{displayName}</Heading>
            <Text>
                <Text color="gray.600">Signed in as</Text>
                 {userEmail}
            </Text>
        </Stack>
    </CardBody>
    <Divider />
    <CardFooter>
        <Button variant='solid'>
            Edit Profile
        </Button>
    </CardFooter>
</Card>
  )
}

export default UserCard