import React from 'react'
import { VStack, Stack, Flex, Box, Text, Badge, Link, Avatar } from '@chakra-ui/react';

const AuthorCard = () => {
    return (
        <Flex flexDirection={{md:"row", sm:"column"}}>
            <Avatar src='https://bit.ly/sage-adebayo' />

            <VStack>
                <Box ml='3'>
                    <Text fontWeight='bold'>
                        Segun Adebayo
                        <Badge ml='1' colorScheme='green' cursor="pointer">
                            Follow
                        </Badge>
                    </Text>
                    <Stack direction={{md:"row", sm:"column"}} spacing={{md:"4", sm:"2"}}>
                        <Text fontSize='sm' color='gray.500'>Published in <Link color="black"> Artificial Corner</Link> </Text>
                        <Text fontSize='sm' color='gray.500'>7 min Read </Text>
                        <Text fontSize='sm' color='gray.500'>May 3</Text>
                    </Stack>
                </Box>
            </VStack>
        </Flex>
    )
}

export default AuthorCard