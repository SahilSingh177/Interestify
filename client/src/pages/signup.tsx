import React from 'react';
import { Flex } from '@chakra-ui/react';
import OAuth from '@/components/Auth/OAuth';
import AuthDivider from '@/components/Auth/AuthDivider';
import SignupForm from '@/components/Auth/SignUpForm';

const signup = () => {
  return (
    <Flex flexDirection="row" height='90vh' justifyContent="center" bgImage="/assets/auth_bg.avif" backgroundSize='cover'>
      <OAuth view="signup"></OAuth>
      <AuthDivider></AuthDivider>
      <SignupForm></SignupForm>
    </Flex>
  )
}

export default signup