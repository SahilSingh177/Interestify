import React from 'react'
import { Stack, Box, Text, Center } from '@chakra-ui/react'
import OauthButtons from './OAuthButtons'

type Props = {
    view: "login" | "signup"
}

const OAuth = ({ view }: Props) => {
    return (
        <>
            <Center>
                <Stack width="50vw" padding="20vh 10vw 0 15vw">
                    <Text maxWidth="20vw" color="white" fontSize="6xl" marginBottom="5vh">{view === "login" ? "Log In" : "Sign Up"}</Text>
                    <OauthButtons imageSrc='/assets/google_icon.png' providerName='Google' />
                    <OauthButtons imageSrc='/assets/facebook_icon.png' providerName='Facebook' />
                </Stack>
            </Center>
        </>
    )
}

export default OAuth