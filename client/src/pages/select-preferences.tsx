import React from 'react'
import { Divider, Flex, VStack, HStack, Text, CSSReset } from '@chakra-ui/react'
import { List } from '@chakra-ui/react'
import CustomList from '@/components/List/CustomList'
import { Button } from '@chakra-ui/react';
import { useRouter } from 'next/router';

const select_preferences = () => {
  const Router = useRouter();
  const handleRegisterInterests = () => {
    // CustomList.handleItemRegistration();
    Router.push('/register_mail')

  }
  return (
    <Flex bgImage="/assets/choose_category_bg.webp" marginTop="-80px" backgroundRepeat="none" backgroundSize="cover" height="100vh" width="100vw" flexDirection="row">
      <Flex width="50%" justifyContent="center" paddingLeft="5%"><CustomList /></Flex>
      <VStack width="50%" alignItems="center" justifyContent="center" flexDirection="column" spacing={5}>
        <Text color="gray.900" fontSize="7xl" fontWeight="extrabold" textAlign="center">SELECT YOUR PREFERENCES</Text>
        <Button variant="continue" bg="#1d4ed8" width="200px" height="50px" fontSize="2xl"
          onClick={() => handleRegisterInterests()}> Continue </Button>
      </VStack>
    </Flex>
  )
}

export default select_preferences