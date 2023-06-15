import React from 'react';
import { auth } from '@/firebase/clientApp';
import { Flex, Box, Card, CardBody, Image, Stack, HStack, Heading, CardFooter, Button, Text } from '@chakra-ui/react';
import 'chart.js/auto';

const UserProfile: React.FC = () => {
    let imageURL = auth.currentUser?.photoURL || undefined;
    if (!imageURL) imageURL = '/assets/default_profile_photo.png'
    //TODO: IT STILL DISPLAYS USER'S DP EVEN IF HE LOGS OUT.
    let displayName = auth.currentUser?.displayName;
    return (
        <Box maxHeight="80vh" height="80vh" width="25vw" padding={5} borderRadius={10}>
            <Card
                direction={{ base: 'column', sm: 'row' }}
                overflow='hidden'
                maxHeight="15vh"
                boxShadow={0}
                borderColor="none"
            >
                <Image
                    objectFit='cover'
                    borderRadius={10}
                    maxW="30%"
                    src={imageURL}
                    alt='Caffe Latte'
                />

                <Flex flexDirection="column" padding="0 5%" flexGrow="1" justifyContent="space-around">
                    <HStack>
                        <Text size='md' fontWeight="semibold">{displayName}</Text>
                    </HStack>
                    <Button variant="transparent" bg="green.100" color="green.600" fontWeight="semibold" fontSize="sm" borderRadius={10} _hover={{ "bg": "green.100" }}>Edit Profile</Button>
                    {/* Open a Modal that asks user to update their username and display photo */}
                </Flex>
            </Card>

        </Box>
    );
}

export default UserProfile;