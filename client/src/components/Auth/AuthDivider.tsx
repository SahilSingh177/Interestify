import { Box, Divider, Text, Center } from '@chakra-ui/react'
import React from 'react'


const AuthDivider: React.FC = () => {
    return (
        <>
            <Box mx={2} padding="5vh 0" width="2vw">
                <Divider orientation='vertical'>
                </Divider>
                <Box
                    position="absolute"
                    top="50%"
                    left="50%"
                    transform="translate(-50%, -50%)"
                    bg="none"
                    borderRadius="10px"
                    border="2px solid"
                    borderColor="white"
                    width="4vw"
                    height="4vw"
                >
                    <Center>
                        <Text fontSize="2xl" color="white" marginTop="0.6vw">
                            OR
                        </Text>
                    </Center>
                </Box>
            </Box>
        </>
    )
}

export default AuthDivider