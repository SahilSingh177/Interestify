import { Box, Divider, Text, Center, AbsoluteCenter } from '@chakra-ui/react'
import React from 'react'


const AuthDivider: React.FC = () => {
    return (
        <>
            <Box mx={2} padding="5vh 0" width="2vw">
                <Divider orientation='vertical' />
                <AbsoluteCenter bg='none' >
                    <Text fontSize="7xl" color="gray.600">
                        OR
                    </Text>
                </AbsoluteCenter>
            </Box>
        </>
    )
}

export default AuthDivider