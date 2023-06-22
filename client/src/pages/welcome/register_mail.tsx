import React, { useState,useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import {
  Stack, Text, Input, SimpleGrid, GridItem,
  InputGroup, InputLeftAddon, InputRightElement, Icon, Box, Button
} from '@chakra-ui/react';
import { FaArrowCircleRight, FaEnvelope } from 'react-icons/fa';
import { AuthContext } from '@/Providers/AuthProvider';

const RegisterMail = () => {
  const currentUser = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.push('http://localhost:3000/login');
    }
  }, [currentUser, router]);

  useEffect(() => {
    const checkCategories = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/hasSelectedCategories',{
          method:'POST',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            "email": currentUser?.email,
          }),
        });
        const data = await response.json();
        console.log(data);
        
        if (!data) {
          router.push('http://localhost:3000/welcome/categories'); 
        }
      } catch (error) {
        console.error('Error checking categories:', error);
      }
    };

    checkCategories();
  }, []);

  const [userEmail, setUserEmail] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserEmail(event.target.value);
  };

  return (
    <Stack
      bgImage="/assets/mail_bg.jpg"
      backgroundRepeat="none"
      backgroundSize="cover"
      height="100vh"
      width="100vw"
      justifyContent="center"
      alignItems="center"
      paddingLeft="25%"
      paddingRight="25%"
    >
      <Text fontSize="6xl" fontWeight="extrabold" textAlign="center" color="gray.700">
        SUBSCRIBE TO OUR MAIL SERVICE
      </Text>
      <Text marginTop="3" color="gray.700" fontSize="2xl" fontWeight="bold">
        Get top personalized articles in your inbox every Sunday
      </Text>
      <Box width="70%" position="relative">
        <SimpleGrid gap={12} p={12} columns={2}>
          <GridItem colSpan={2}>
            <InputGroup variant="custom" colorScheme="purple">
              <InputLeftAddon bg="red.500" color="white">Email:</InputLeftAddon>
              <Input
                placeholder="Enter Your Email"
                value={userEmail}
                onChange={handleChange}
              />
              <InputRightElement pointerEvents="none">
                <Icon as={FaEnvelope} color="red.500" />
              </InputRightElement>
            </InputGroup>
          </GridItem>
        </SimpleGrid>
      </Box>
      <Button
        variant="danger"
        size="lg"
        borderRadius="7"
        bg="red.500"
        onClick={() => router.push('/')}
      >
        Register
      </Button>
      <Text marginTop="3" color="gray.600" fontSize="md" fontWeight="bold">
        You can unsubscribe anytime.
      </Text>
      <Icon
        onClick={() => router.push('/')}
        cursor="pointer"
        boxSize="5vw"
        as={FaArrowCircleRight}
        position="fixed"
        bottom="2vw"
        right="2vw"
      />
    </Stack>
  );
};

export default RegisterMail;
