import React from 'react';
import { Flex } from '@chakra-ui/react';
import OAuth from '@/components/Auth/OAuth';
import AuthDivider from '@/components/Auth/AuthDivider';
import SignupForm from '@/components/Auth/SignUpForm';
import Head from 'next/head';

const signup = () => {
  return (
    <>
      <Head>
        <title>Interestify - Sign Up</title>
      </Head>
      <Flex flexDirection={['column','column','column','row']} minHeight='90vh' justifyContent="center" bgImage="/assets/auth_bg.avif" backgroundSize='cover'>
        <OAuth view="signup"></OAuth>
        <AuthDivider></AuthDivider>
        <SignupForm></SignupForm>
      </Flex>
    </>
  )
}

export default signup