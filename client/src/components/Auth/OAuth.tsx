import React from 'react'
import { Stack, Text, Center } from '@chakra-ui/react'
import OauthButtons from './OAuthButtons'

type Props = {
    view: "login" | "signup"
}

const OAuth = ({ view }: Props) => {
    return (
        <>
            <Center>
                <Stack width={['100vw','100vw','100vw','50vw']} padding="20vh 10vw 10vh 10vw"
                paddingTop={['5vh','5vh','5vh','20vh']} paddingBottom={['0','0','0','10vh']}
                >
                    <Text textAlign='center' color="white" fontSize={['5xl','6xl','6xl','6xl']} marginBottom="5vh">{view === "login" ? "Log In" : "Sign Up"}</Text>
                    <OauthButtons imageSrc='https://icons8.com/icon/17949/google' providerName='Google' />
                    <OauthButtons imageSrc='https://icons8.com/icon/uLWV5A9vXIPu/facebook' providerName='Facebook' />
                </Stack>
            </Center>
        </>
    )
}

export default OAuth