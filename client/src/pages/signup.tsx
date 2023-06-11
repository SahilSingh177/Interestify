import React from 'react';
import { Flex, Box, Divider, Text } from '@chakra-ui/react';
import OAuth from '@/components/Auth/OAuth';
import AuthDivider from '@/components/Auth/AuthDivider';
import SignupForm from '@/components/Auth/SignUpForm';

type Props = {}

const signup = (props: Props) => {
  return (
    <Flex flexDirection="row" height={`calc(100vh - 60px)`} justifyContent="center" bgImage="/assets/auth_bg.avif">
    <OAuth view="signup"></OAuth>
    <AuthDivider></AuthDivider>
    <SignupForm></SignupForm>
  </Flex>
  )
}

export default signup