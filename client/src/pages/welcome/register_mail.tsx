import React, { useState, useEffect, useContext } from 'react';
import type { ReactElement } from 'react'
import { useRouter } from 'next/router';
import {
  Stack, Text, Input, SimpleGrid, GridItem, Heading,
  InputGroup, InputLeftAddon, InputRightElement, Icon, Box, Button
} from '@chakra-ui/react';
import { FaArrowCircleRight, FaEnvelope } from 'react-icons/fa';
import { AuthContext } from '@/Providers/AuthProvider';
import { NextPageWithLayout } from '../_app';
import Head from 'next/head';
import { auth } from '@/firebase/clientApp';

const RegisterMail: NextPageWithLayout = () => {
  const currentUser = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    }
  }, [currentUser, router]);

  useEffect(() => {
    const checkCategories = async () => {
      try {
        const response = await fetch('https://nikhilranjan.pythonanywhere.com/hasSelectedCategories', {
          method: 'POST',
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
          router.push('/welcome/categories');
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
  const registerUser = async () => {
    try {
      const email = auth.currentUser?.email;
      const resp = await fetch(`https://nikhilranjan.pythonanywhere.com/registerMail?email=${email}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });

      const data = await resp.json();
      console.log(data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
    router.push('/')
  };
  return (
    <>
      <Head>
        <title>Interestify - Select Categories</title>
      </Head>
      <Stack
        bgImage="/assets/mail_bg.jpg"
        backgroundRepeat="none"
        backgroundSize="cover"
        height="100vh"
        width="100vw"
        justifyContent="center"
        alignItems="center"
        paddingLeft={["5%", "5%", "15%", "25%"]}
        paddingRight={["5%", "5%", "15%", "25%"]}
      >
        <Heading fontSize={["4xl", "4xl", "6xl", "6xl"]} fontWeight="extrabold" textAlign="center" color="gray.700">
          SUBSCRIBE TO OUR MAIL SERVICE
        </Heading>
        <Text marginTop="3" color="gray.700" fontSize={["xl", "xl", "2xl", "2xl"]} fontWeight="bold" textAlign="center">
          Get top personalized articles in your inbox every Sunday
        </Text>
        <Box width={['100%', '70%']} position="relative">
          <SimpleGrid gap={[6, 12]} p={[6, 12]} columns={[1, 2]}>
            <GridItem colSpan={[1, 2]}>
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
          boxSize={["10vw","10vw","5vw","5vw"]}
          as={FaArrowCircleRight}
          position="fixed"
          bottom="2vw"
          right="2vw"
        />
      </Stack>
    </>
  );
};

RegisterMail.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      {page}
    </>
  )
}

export default RegisterMail;
