import { Box, Divider, Text, Center, AbsoluteCenter } from '@chakra-ui/react'
import React from 'react'


const AuthDivider: React.FC = () => {
    return (
        <>
            <Box
                mx={2}
                paddingTop={['0', '0', '0', '5vh']}
                paddingBottom={['0', '0', '0', '5vh']}
                paddingLeft={['5vw', '5vw', '5vw', '0']}
                paddingRight={['5vw', '5vw', '5vw', '0']}
                marginTop={['3vh', '3vh', '3vh', '0']}
                marginBottom={['3vh', '3vh', '3vh', '0']}

                width={['100vw', '100vw', '100vw', '2vw']}
                height={['5vh', '5vh', '5vh', 'auto']}
                display={['block', 'block', 'block', 'block']}
            >
                <Divider orientation='vertical' display={['none', 'none', 'none', 'block']} />
                <AbsoluteCenter bg='none' display={['none', 'none', 'none', 'block']}>
                    <Text fontSize={['5xl', '6xl', '7xl', '7xl']} color="gray.600">
                        OR
                    </Text>
                </AbsoluteCenter>
                <Text textAlign='center' display={['block', 'block', 'block', 'none']} fontSize={['5xl', '6xl', '7xl', '7xl']} color="gray.600">
                    OR
                </Text>
            </Box>
        </>
    )
}

export default AuthDivider