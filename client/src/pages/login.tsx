import React from 'react';
import { Flex, Box, Divider, Text } from '@chakra-ui/react';
import OAuth from '@/components/Auth/OAuth';
import AuthDivider from '@/components/Auth/AuthDivider';
import LoginForm from '@/components/Auth/LoginForm';

const Login = () => {
  return (
    <Flex flexDirection="row" height={`calc(100vh - 60px)`} justifyContent="center" bgImage="/assets/auth_bg.avif">
      <OAuth view="login"></OAuth>
      <AuthDivider></AuthDivider>
      <LoginForm></LoginForm>
    </Flex>
  );
};

export default Login;
