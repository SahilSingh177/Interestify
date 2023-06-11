import React from 'react'
import { Flex, Text } from '@chakra-ui/react'
import Link from 'next/link';

type Props = {
    view:"login" | "signup"
}

const Redirect = ({view}: Props) => {
  let redirect = view=="login" ?"signup" : "login"
  let text = view=="login" ? "Need an Account?" : "Already a member?"
  return (
    <Flex justifyContent="center">
        <Link href={redirect} style={{ color: 'gray' }}>{text}</Link>
    </Flex>
    //chakra white not working would fix later
  )
}

export default Redirect